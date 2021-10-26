import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import { VpnBearer, VpnCarrier, VpnNode } from '../../components/forms/bearer-types';
import { apiVpnCarriersToClientCarriers, apiVpnNodesToClientVpnNodes } from '../../components/forms/converters';
import VpnBearerForm from '../../components/forms/vpn-bearer-form';

// const defaultVpnNode: VpnNode = {
//   neId: '',
//   routerId: '',
//   role: null,
// };

const defaultVpnBearer: VpnBearer = {
  neId: '',
  portId: '',
  spBearerReference: '',
  carrier: null,
  defaultUpstreamBearer: null,
  connection: null,
  description: null,
  evcAttachments: [],
  status: null,
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateBearerPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [nodes, setNodes] = useState<VpnNode[] | null>(null);
  const [carriers, setCarriers] = useState<VpnCarrier[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      // TODO; possible fetches goes here
      const callbacks = callbackUtils.getCallbacks;
      const apiNodes = await callbacks.getVpnNodes();
      const clientNodes = apiVpnNodesToClientVpnNodes(apiNodes);
      const apiCarriers = await callbacks.getVpnCarriers();
      const clientCarriers = apiVpnCarriersToClientCarriers(apiCarriers);
      setNodes(clientNodes);
      setCarriers(clientCarriers);
    };

    fetchData();
  }, []);

  const handleSubmit = async (bearer: VpnBearer) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', bearer);
    // eslint-disable-next-line no-param-reassign
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.createVpnBearer(bearer);
    // eslint-disable-next-line no-console
    console.log('bearer created');
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  if (!nodes || !carriers) {
    return null;
  }

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Bearer</Heading>
        <VpnBearerForm
          mode="add"
          bearer={defaultVpnBearer}
          nodes={nodes}
          carriers={carriers}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
};

export default CreateBearerPage;
