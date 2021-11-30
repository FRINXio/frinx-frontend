import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import callbackUtils from '../../unistore-callback-utils';
import { VpnBearer, VpnCarrier, VpnNode } from '../../components/forms/bearer-types';
import {
  apiVpnNodesToClientVpnNodes,
  apiBearerToClientBearer,
  apiVpnCarriersToClientCarriers,
} from '../../components/forms/converters';
import VpnBearerForm from '../../components/forms/vpn-bearer-form';
import ErrorMessage from '../../components/error-message/error-message';

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const EditBearerPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [bearer, setBearer] = useState<VpnBearer | null>(null);
  const [nodes, setNodes] = useState<VpnNode[] | null>(null);
  const [carriers, setCarriers] = useState<VpnCarrier[] | null>(null);
  const { bearerId } = useParams<{ bearerId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      // TODO; possible fetches goes here
      const callbacks = callbackUtils.getCallbacks;
      const response = await callbacks.getVpnBearers(null, null);
      const clientVpnBearers = apiBearerToClientBearer(response);
      const [selectedBearer] = clientVpnBearers.filter((b) => b.spBearerReference === bearerId);
      const apiNodes = await callbacks.getVpnNodes();
      const clientNodes = apiVpnNodesToClientVpnNodes(apiNodes);
      const apiCarriers = await callbacks.getVpnCarriers();
      const clientCarriers = apiVpnCarriersToClientCarriers(apiCarriers);
      setNodes(clientNodes);
      setCarriers(clientCarriers);
      setBearer(selectedBearer);
    };

    fetchData();
  }, [bearerId]);

  const handleSubmit = async (vpnBearer: VpnBearer) => {
    setSubmitError(null);
    // eslint-disable-next-line no-console
    console.log('submit clicked', vpnBearer);
    const callbacks = callbackUtils.getCallbacks;
    try {
      await callbacks.editVpnBearer(vpnBearer);
      // eslint-disable-next-line no-console
      console.log('bearer created');
      onSuccess();
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  if (!bearer || !nodes || !carriers) {
    return null;
  }

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Edit VPN Bearer</Heading>
        {submitError && <ErrorMessage text={String(submitError)} />}
        <VpnBearerForm
          mode="edit"
          nodes={nodes}
          carriers={carriers}
          bearer={bearer}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
};

export default EditBearerPage;
