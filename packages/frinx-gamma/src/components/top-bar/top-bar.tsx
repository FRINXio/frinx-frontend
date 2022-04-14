import { Button, Container, HStack, Icon, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';
import { getTransactionId, removeTransactionId, setTransactionId } from '../../helpers/transaction-id';
import unwrap from '../../helpers/unwrap';
import useCalcDiffContext from '../../providers/calcdiff-provider/use-calcdiff-context';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import CommitStatusModal from '../commit-status-modal/commit-status-modal';
import { CalcDiffPayload } from '../commit-status-modal/commit-status-modal.helpers';
import DiscardChangesModal from '../discard-changes-modal/discard-changes';

function getKeysLength<T extends Record<string, unknown>>(value: T): number {
  return Object.keys(value).length;
}

function getServicesSitesActionEnabled(
  payload: { service: CalcDiffPayload | null; bearer: CalcDiffPayload | null } | null,
): { isServiceEnabled: boolean; isBearerEnabled: boolean } {
  if (payload == null) {
    return { isServiceEnabled: false, isBearerEnabled: false };
  }
  const { service } = payload;
  return {
    isServiceEnabled:
      service != null
        ? getKeysLength(service.changes.creates.sites) +
            getKeysLength(service.changes.creates['vpn-services']) +
            getKeysLength(service.changes.updates.sites) +
            getKeysLength(service.changes.updates['vpn-services']) +
            service.changes.deletes.site.length +
            service.changes.deletes.vpn_service.length >
          0
        : false,
    // TODO: get bearer data
    isBearerEnabled: false,
  };
}

type WorkflowState = { type: 'service' | 'bearer'; id: string };

const TopBar: VoidFunctionComponent = () => {
  const discardChangesDisclosure = useDisclosure();
  const location = useLocation();
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [isCommitLoading, setIsCommitLoading] = useState(false);
  const { data: calcDiffData, invalidateCache } = useCalcDiffContext();
  const isBearerPage = location.pathname.includes('vpn-bearers');
  const { isServiceEnabled } = getServicesSitesActionEnabled(calcDiffData);

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
    setIsCommitLoading(true);
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
    setIsCommitLoading(true);
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

  const handleWorkflowFinish = (isSuccessful: boolean) => {
    setIsCommitLoading(false);

    if (!isSuccessful) {
      return;
    }

    // set new transaction id after successful commit
    removeTransactionId();
    const unistoreCallbacks = unistoreCallbackUtils.getCallbacks;
    unistoreCallbacks.getTransactionCookie().then((data) => {
      setTransactionId(data);
    });
  };

  return (
    <>
      {workflowState != null && (
        <CommitStatusModal
          isOpen
          onClose={() => {
            invalidateCache();
            setWorkflowState(null);
          }}
          workflowId={workflowState.id}
          onWorkflowFinish={handleWorkflowFinish}
          isLoading={isCommitLoading}
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
            isDisabled={!isServiceEnabled}
            isLoading={isCommitLoading}
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
            isDisabled={isBearerPage ? false : !isServiceEnabled}
            isLoading={isCommitLoading}
          >
            Commit changes
          </Button>
        </HStack>
      </Container>
    </>
  );
};

export default TopBar;
