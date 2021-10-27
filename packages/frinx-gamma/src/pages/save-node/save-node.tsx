import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
import VpnNodeForm from '../../components/forms/vpn-node-form';
import { VpnNode } from '../../components/forms/bearer-types';
import { apiVpnNodesToClientVpnNodes } from '../../components/forms/converters';
import callbackUtils from '../../callback-utils';

const getDefaultNode = (): VpnNode => ({
  neId: '',
  routerId: '',
  role: null,
});

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const SaveNodePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [nodes, setNodes] = useState<VpnNode[] | null>(null);
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

    await callbacks.editVpnNode(node);
    // eslint-disable-next-line no-console
    console.log('bearer saved');
    onSuccess();
  };

  const handleDelete = async (nodeId: string) => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', nodeId);
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.deleteVpnNode(nodeId);
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
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
