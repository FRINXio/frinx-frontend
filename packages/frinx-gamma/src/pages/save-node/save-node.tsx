import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import VpnNodeForm from '../../components/forms/vpn-node-form';
import { VpnNode } from '../../components/forms/bearer-types';
import { apiVpnNodesToClientVpnNodes, clientVpnNodeToApiVpnNode } from '../../components/forms/converters';
import callbackUtils from '../../unistore-callback-utils';

const getDefaultNode = (): VpnNode => ({
  neId: '',
  routerId: '',
  role: null,
});

const SaveNodePage: VoidFunctionComponent = () => {
  const [nodes, setNodes] = useState<VpnNode[] | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      // TODO; possible fetches goes here
      const callbacks = callbackUtils.getCallbacks;
      const apiNodes = await callbacks.getVpnNodes();
      const clientNodes = apiVpnNodesToClientVpnNodes(apiNodes);
      setNodes(clientNodes);
    };

    fetchData();
  }, []);

  const handleSubmit = async (node: VpnNode) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', node);
    const callbacks = callbackUtils.getCallbacks;
    const apiNode = clientVpnNodeToApiVpnNode(node);
    await callbacks.editVpnNode(apiNode);
    // eslint-disable-next-line no-console
    console.log('bearer saved');
    navigate(`../vpn-bearers`);
  };

  const handleDelete = async (nodeId: string) => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', nodeId);
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.deleteVpnNode(nodeId);
    navigate(`../vpn-bearers`);
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    navigate(`../vpn-bearers`);
  };

  if (!nodes) {
    return null;
  }

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <VpnNodeForm
          nodes={nodes || []}
          node={getDefaultNode()}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
};

export default SaveNodePage;
