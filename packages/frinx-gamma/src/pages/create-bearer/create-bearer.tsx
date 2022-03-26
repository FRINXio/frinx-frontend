import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../unistore-callback-utils';
import { Carrier, Connection, VpnBearer, VpnCarrier, VpnNode } from '../../components/forms/bearer-types';
import {
  apiVpnCarriersToClientCarriers,
  apiVpnNodesToClientVpnNodes,
  clientBearerToApiBearer,
} from '../../components/forms/converters';
import VpnBearerForm from '../../components/forms/vpn-bearer-form';
import ErrorMessage from '../../components/error-message/error-message';
import { useNavigate } from 'react-router-dom';

// const defaultVpnNode: VpnNode = {
//   neId: '',
//   routerId: '',
//   role: null,
// };

const defaultConnection: Connection = {
  encapsulationType: null,
  mtu: 1500,
  remoteNeId: null,
  remotePortId: null,
  svlanAssignmentType: 'auto',
  tpId: 'dot1ad',
};

const defaultCarrier: Carrier = {
  carrierName: null,
  carrierReference: null,
  serviceStatus: null,
  serviceType: 'evc',
};

const defaultVpnBearer: VpnBearer = {
  neId: '',
  portId: '',
  spBearerReference: '',
  carrier: defaultCarrier,
  defaultUpstreamBearer: null,
  connection: defaultConnection,
  description: null,
  evcAttachments: [],
  status: null,
};

const CreateBearerPage: VoidFunctionComponent = () => {
  const [nodes, setNodes] = useState<VpnNode[] | null>(null);
  const [carriers, setCarriers] = useState<VpnCarrier[] | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
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
    setSubmitError(null);
    // eslint-disable-next-line no-console
    console.log('submit clicked', bearer);
    // eslint-disable-next-line no-param-reassign
    const callbacks = callbackUtils.getCallbacks;
    try {
      const apiBearer = clientBearerToApiBearer(bearer);
      await callbacks.createVpnBearer(apiBearer);
      // eslint-disable-next-line no-console
      console.log('bearer created');
      navigate('../vpn-bearers');
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    navigate('../vpn-bearers');
  };

  if (!nodes || !carriers) {
    return null;
  }

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Bearer</Heading>
        {submitError && <ErrorMessage text={String(submitError)} />}
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
