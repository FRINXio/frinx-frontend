import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import callbackUtils from '../../callback-utils';
import { VpnBearer } from '../../components/forms/bearer-types';
import { apiBearerToClientBearer } from '../../components/forms/converters';
import VpnBearerForm from '../../components/forms/vpn-bearer-form';

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const EditBearerPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [bearer, setBearer] = useState<VpnBearer | null>(null);
  const { bearerId } = useParams<{ bearerId: string }>();
  useEffect(() => {
    const fetchData = async () => {
      // TODO; possible fetches goes here
      const callbacks = callbackUtils.getCallbacks;
      const response = await callbacks.getVpnBearers();
      const clientVpnBearers = apiBearerToClientBearer(response);
      const [selectedBearer] = clientVpnBearers.filter((b) => b.spBearerReference === bearerId);
      setBearer(selectedBearer);
    };

    fetchData();
  }, [bearerId]);

  const handleSubmit = async (vpnBearer: VpnBearer) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', vpnBearer);
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.editVpnBearer(vpnBearer);
    // eslint-disable-next-line no-console
    console.log('bearer created');
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  if (!bearer) {
    return null;
  }

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">kEdit VPN Bearer</Heading>
        <VpnBearerForm mode="add" bearer={bearer} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Box>
    </Container>
  );
};

export default EditBearerPage;
