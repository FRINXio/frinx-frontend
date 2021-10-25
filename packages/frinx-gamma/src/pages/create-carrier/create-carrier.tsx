import React, { VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import VpnCarrierForm from '../../components/forms/vpn-carrier-form';
import { VpnCarrier } from '../../components/forms/bearer-types';
import callbackUtils from '../../callback-utils';

const getDefaultCarrier = (): VpnCarrier => ({
  name: '',
  description: null,
});

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateCarrierPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const handleSubmit = async (carrier: VpnCarrier) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', carrier);
    const callbacks = callbackUtils.getCallbacks;

    await callbacks.createVpnCarrier(carrier);
    // eslint-disable-next-line no-console
    console.log('site saved: network access added to site');
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Box>
          <Heading size="md" marginBottom={2}>
            Add Carrier
          </Heading>
        </Box>
        <VpnCarrierForm carrier={getDefaultCarrier()} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Box>
    </Container>
  );
};

export default CreateCarrierPage;
