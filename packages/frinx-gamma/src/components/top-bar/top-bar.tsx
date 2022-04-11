import { Button, Container, HStack, Icon, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';
import { getTransactionId, removeTransactionId, setTransactionId } from '../../helpers/transaction-id';
import unwrap from '../../helpers/unwrap';
import useCalcDiffContext from '../../providers/calcdiff-provider/user-calcdiff-context';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import CommitStatusModal from '../commit-status-modal/commit-status-modal';
import { CalcDiffPayload } from '../commit-status-modal/commit-status-modal.helpers';
import DiscardChangesModal from '../discard-changes-modal/discard-changes';

function getKeysLength<T extends Record<string, unknown>>(value: T): number {
  return Object.keys(value).length;
}

function getServicesSitesActionEnabled(payload: CalcDiffPayload | null): boolean {
  if (payload == null) {
    return false;
  }
  const { changes } = payload;
  return (
    getKeysLength(changes.creates.sites) +
      getKeysLength(changes.creates['vpn-services']) +
      getKeysLength(changes.updates.sites) +
      getKeysLength(changes.updates['vpn-services']) +
      changes.deletes.site.length +
      changes.deletes.vpn_service.length >
    0
  );
}

type WorkflowState = { type: 'service' | 'bearer'; id: string };

const TopBar: VoidFunctionComponent = () => {
  const discardChangesDisclosure = useDisclosure();
  const location = useLocation();
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const { data: calcDiffData, invalidateCache } = useCalcDiffContext();
  const isBearerPage = location.pathname.includes('vpn-bearers');
  const isCommitDiscardButtonDisabled = !getServicesSitesActionEnabled(calcDiffData);

  const handleDiscardConfirmBtnClick = async () => {
    const callbacks = unistoreCallbackUtils.getCallbacks;
    // TODO: close transaction endpoint response is empty 200, so our helper function fails to parse it
    // we can handle it in our api-helpers.ts or find other solution instead of try/catch
    try {
      await callbacks.closeTransaction();
    } catch (e) {
      removeTransactionId();
      const data = await callbacks.getTransactionCookie();
      setTransactionId(data);
      invalidateCache();
      discardChangesDisclosure.onClose();
    }
  };

  const handleDiscardBtnClick = () => {
    discardChangesDisclosure.onOpen();
  };

  const handleServiceCommitBtnClick = () => {
    const callbacks = uniflowCallbackUtils.getCallbacks;
    callbacks
      .executeWorkflow({
        name: 'Render_all',
        version: 1,
        input: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          unistore_node_name: 'service',
          action: 'dryrun',
          US_UI_TX: unwrap(getTransactionId()),
        },
      })
      .then((data) => {
        setWorkflowState({
          type: 'service',
          id: data.text,
        });
      });
  };

  const handleBearerCommitBtnClick = () => {
    const callbacks = uniflowCallbackUtils.getCallbacks;
    callbacks
      .executeWorkflow({
        name: 'Render_bearer',
        version: 2,
        input: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          unistore_node_name: 'bearer',
          action: 'dryrun',
          US_UI_TX: unwrap(getTransactionId()),
        },
      })
      .then((data) => {
        setWorkflowState({
          type: 'bearer',
          id: data.text,
        });
      });
  };

  const handleWorkflowFinish = (isCompleted: boolean) => {
    setWorkflowState(null);

    if (!isCompleted) {
      return;
    }

    // set new transaction id after successful commit
    removeTransactionId();
    const unistoreCallbacks = unistoreCallbackUtils.getCallbacks;
    unistoreCallbacks.getTransactionCookie().then((data) => {
      setTransactionId(data);
      invalidateCache();
    });
  };

  return (
    <>
      {workflowState != null && (
        <CommitStatusModal
          isOpen
          onClose={() => {
            setWorkflowState(null);
          }}
          workflowId={workflowState.id}
          onWorkflowFinish={handleWorkflowFinish}
        />
      )}
      <DiscardChangesModal
        isOpen={discardChangesDisclosure.isOpen}
        onClose={discardChangesDisclosure.onClose}
        onConfirmBtnClick={handleDiscardConfirmBtnClick}
        title="Discard changes"
      >
        Are you sure you want to discard your changes?
      </DiscardChangesModal>
      <Container
        maxWidth={1280}
        marginBottom={8}
        paddingBottom={4}
        borderBottom="1px solid"
        borderBottomColor="gray.200"
      >
        <HStack justifyContent="flex-end" spacing={2}>
          <Button
            aria-label="Discard changes"
            leftIcon={<Icon as={FeatherIcon} icon="trash" />}
            onClick={handleDiscardBtnClick}
            colorScheme="red"
            isDisabled={isCommitDiscardButtonDisabled}
          >
            Discard Changes
          </Button>

          <Button
            aria-label="Commit changes"
            colorScheme="blue"
            leftIcon={<Icon as={FeatherIcon} icon="git-commit" />}
            onClick={() => {
              if (isBearerPage) {
                return handleBearerCommitBtnClick();
              }
              return handleServiceCommitBtnClick();
            }}
            isDisabled={isCommitDiscardButtonDisabled}
          >
            Commit changes
          </Button>
        </HStack>
      </Container>
    </>
  );
};

export default TopBar;
