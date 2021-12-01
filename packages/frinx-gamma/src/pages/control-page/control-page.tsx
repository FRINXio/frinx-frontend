import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import { getTransactionId } from '../../helpers/transaction-id';
import ControlPageTable from './control-page-table';
import unwrap from '../../helpers/unwrap';
import {
  CalcDiffPayload,
  ExecutedWorkflowPayload,
  useAsyncGenerator,
} from '../../components/commit-status-modal/commit-status-modal.helpers';

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
  const [countState, setCountState] = useState<TotalCountState>(DEFAULT_UNCOMMITED_CHANGES);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const onFinish = () => {
    setWorkflowId(null);
  };
  const workflowPayload = useAsyncGenerator<CalcDiffPayload>({ workflowId, onFinish });
  // console.log(workflowId);

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
          unistore_node_name: 'network',
          action: 'commit',
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
          action: 'commit',
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

  const handleWorkflowFinish = () => {
    setWorkflowState(null);
  };

  const uncommitedChanges = makeTotalCountState(countState, workflowPayload);

  return (
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
          onBearerDiscardBtnClick={() => {
            // eslint-disable-next-line no-console
            console.log('Discard changes');
          }}
          onServiceDiscardBtnClick={() => {
            // eslint-disable-next-line no-console
            console.log('Discard changes');
          }}
          onWorkflowFinish={handleWorkflowFinish}
        />
      </Box>
    </Container>
  );
};

export default ControlPage;
