import { Box, Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import { getTransactionId, setTransactionId, removeTransactionId } from '../../helpers/transaction-id';
import ControlPageTable from './control-page-table';
import unwrap from '../../helpers/unwrap';
import {
  CalcDiffPayload,
  ExecutedWorkflowPayload,
  useAsyncGenerator,
} from '../../components/commit-status-modal/commit-status-modal.helpers';
import DiscardChangesModal from '../../components/discard-changes-modal/discard-changes';

type Props = {
  onServicesSiteLinkClick: () => void;
  onSitesSiteLinkClick: () => void;
  onVpnBearerLinkClick: () => void;
};

type CountState = {
  services: number;
  sites: number;
  bearers: number;
};
type WorkflowState = { type: 'service' | 'bearer'; id: string };
type TotalCountState = {
  total: CountState | null;
  added: CountState | null;
  updated: CountState | null;
  deleted: CountState | null;
};
const DEFAULT_UNCOMMITED_CHANGES: TotalCountState = {
  total: null,
  added: null,
  updated: null,
  deleted: null,
};

function makeTotalCountState(
  countState: TotalCountState,
  payload: ExecutedWorkflowPayload<CalcDiffPayload> | null,
): TotalCountState {
  if (payload?.status === 'COMPLETED') {
    const { changes } = payload.output;
    return {
      total: countState.total,
      added: {
        services: Object.keys(changes.creates['vpn-services']).length,
        bearers: 0,
        sites: Object.keys(changes.creates.sites).length,
      },
      updated: {
        services: Object.keys(changes.updates['vpn-services']).length,
        bearers: 0,
        sites: Object.keys(changes.updates.sites).length,
      },
      deleted: {
        services: changes.deletes.vpn_service.length,
        bearers: 0,
        sites: changes.deletes.site.length,
      },
    };
  }
  return DEFAULT_UNCOMMITED_CHANGES;
}

const ControlPage: VoidFunctionComponent<Props> = ({
  onServicesSiteLinkClick,
  onSitesSiteLinkClick,
  onVpnBearerLinkClick,
}) => {
  const discardChangesDisclosure = useDisclosure();
  const [countState, setCountState] = useState<TotalCountState>(DEFAULT_UNCOMMITED_CHANGES);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const onFinish = () => {
    setWorkflowId(null);
  };
  const workflowPayload = useAsyncGenerator<CalcDiffPayload>({ workflowId, onFinish });

  useEffect(() => {
    (async () => {
      const callbacks = unistoreCallbackUtils.getCallbacks;
      const [serviceCount, siteCount, bearerCount] = await Promise.all([
        callbacks.getVpnServiceCount(null),
        callbacks.getVpnSiteCount(null),
        callbacks.getVpnBearerCount(null),
      ]);
      setCountState((prev) => ({
        ...prev,
        total: {
          services: serviceCount,
          sites: siteCount,
          bearers: bearerCount,
        },
      }));
    })();
  }, []);

  useEffect(() => {
    const callbacks = uniflowCallbackUtils.getCallbacks;

    callbacks
      .executeWorkflow({
        name: 'Process_calcdiff_ui',
        version: 2,
        input: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          unistore_node_name: 'network',
          US_UI_TX: unwrap(getTransactionId()),
        },
      })
      .then((data) => {
        setWorkflowId(data.text);
      });
  }, []);

  function handleServiceCommitBtnClick() {
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
  }

  function handleBearerCommitBtnClick() {
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
  }

  async function handleDiscardConfirmBtnClick() {
    const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;

    const deallocations = [
      uniflowCallbacks.executeWorkflow({
        name: 'Free_VpnServiceId',
        version: 1,
        input: {},
      }),
      uniflowCallbacks.executeWorkflow({
        name: 'Free_CustomerAddress',
        version: 1,
        input: {},
      }),
      uniflowCallbacks.executeWorkflow({
        name: 'Free_SvlanId',
        version: 1,
        input: {},
      }),
    ];

    await Promise.all(deallocations);

    const callbacks = unistoreCallbackUtils.getCallbacks;
    // TODO: close transaction endpoint response is empty 200, so our helper function fails to parse it
    // we can handle it in our api-helpers.ts or find other solution instead of try/catch
    try {
      await callbacks.closeTransaction();
    } catch (e) {
      removeTransactionId();
      const data = await callbacks.getTransactionCookie();
      setTransactionId(data);
      discardChangesDisclosure.onClose();
    }
  }

  function handleDiscardBtnClick() {
    discardChangesDisclosure.onOpen();
  }

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
    });
  };

  const uncommitedChanges = makeTotalCountState(countState, workflowPayload);

  return (
    <>
      <DiscardChangesModal
        isOpen={discardChangesDisclosure.isOpen}
        onClose={discardChangesDisclosure.onClose}
        onConfirmBtnClick={handleDiscardConfirmBtnClick}
        title="Discard changes"
      >
        Are you sure you want to discard your changes?
      </DiscardChangesModal>
      <Container maxWidth={1280} minHeight="60vh">
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Control page
          </Heading>
        </Flex>
        <Box>
          <ControlPageTable
            onServicesSiteLinkClick={onServicesSiteLinkClick}
            onSitesSiteLinkClick={onSitesSiteLinkClick}
            onVpnBearerLinkClick={onVpnBearerLinkClick}
            countState={{
              ...uncommitedChanges,
              total: countState.total,
            }}
            workflowState={workflowState}
            onServiceCommitBtnClick={handleServiceCommitBtnClick}
            onBearerCommitBtnClick={handleBearerCommitBtnClick}
            onBearerDiscardBtnClick={handleDiscardBtnClick}
            onServiceDiscardBtnClick={handleDiscardBtnClick}
            onWorkflowFinish={handleWorkflowFinish}
          />
        </Box>
      </Container>
    </>
  );
};

export default ControlPage;
