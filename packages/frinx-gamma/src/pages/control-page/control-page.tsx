import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import ControlPageTable from './control-page-table';

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
const DEFAULT_STATE: CountState = {
  services: 0,
  sites: 0,
  bearers: 0,
};

const ControlPage: VoidFunctionComponent<Props> = ({
  onServicesSiteLinkClick,
  onSitesSiteLinkClick,
  onVpnBearerLinkClick,
}) => {
  const [countState, setCountState] = useState<CountState>(DEFAULT_STATE);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);

  useEffect(() => {
    (async () => {
      const callbacks = unistoreCallbackUtils.getCallbacks;
      const [serviceCount, siteCount, bearerCount] = await Promise.all([
        callbacks.getVpnServiceCount(null),
        callbacks.getVpnSiteCount(null),
        callbacks.getVpnBearerCount(null),
      ]);
      setCountState({
        services: serviceCount,
        sites: siteCount,
        bearers: bearerCount,
      });
    })();
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
          countState={countState}
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
