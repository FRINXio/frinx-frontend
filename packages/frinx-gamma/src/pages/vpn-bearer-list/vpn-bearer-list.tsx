import { Box, Button, Container, Flex, Heading, HStack, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import CommitStatusModal from '../../components/commit-status-modal/commit-status-modal';
import { VpnBearer } from '../../components/forms/bearer-types';
import { apiBearerToClientBearer } from '../../components/forms/converters';
import VpnBearerTable from './vpn-bearer-table';

type Props = {
  onCreateVpnBearerClick: () => void;
  onEditVpnBearerClick: () => void;
};

const VpnBearerList: VoidFunctionComponent<Props> = ({ onCreateVpnBearerClick, onEditVpnBearerClick }) => {
  const [vpnBearers, setVpnBearers] = useState<VpnBearer[] | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const response = await callbacks.getVpnBearers();
      const clientVpnBearers = apiBearerToClientBearer(response);
      setVpnBearers(clientVpnBearers);
    };

    fetchData();
  }, []);

  function handleCommitBtnClick() {
    const callbacks = callbackUtils.getCallbacks;
    callbacks
      .executeWorkflow({
        name: 'Render_bearer',
        version: 2,
        input: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          unistore_node_name: 'service_scale',
          action: 'commit',
        },
      })
      .then((data) => {
        setWorkflowId(data.text);
      });
  }

  return (
    <>
      {workflowId != null && (
        <CommitStatusModal
          workflowId={workflowId}
          isOpen
          onClose={() => {
            setWorkflowId(null);
          }}
        />
      )}
      <Container maxWidth={1200}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Bearers
          </Heading>
          <HStack>
            <Button variant="outline" colorScheme="blue" onClick={handleCommitBtnClick}>
              Commit changes
            </Button>
            <Button
              colorScheme="blue"
              onClick={onCreateVpnBearerClick}
              leftIcon={<Icon as={FeatherIcon} icon="plus" />}
            >
              Add bearer
            </Button>
          </HStack>
        </Flex>
        <Box>{vpnBearers && <VpnBearerTable bearers={vpnBearers} onEditVpnBearerClick={onEditVpnBearerClick} />}</Box>
      </Container>
    </>
  );
};

export default VpnBearerList;
