import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
import VpnCarrierForm from '../../components/forms/vpn-carrier-form';
import { VpnCarrier } from '../../components/forms/bearer-types';
import { apiVpnCarriersToClientCarriers } from '../../components/forms/converters';
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
  const [carriers, setCarriers] = useState<VpnCarrier[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      // TODO; possible fetches goes here
      const callbacks = callbackUtils.getCallbacks;
      const apiCarriers = await callbacks.getVpnCarriers();
      const clientCarriers = apiVpnCarriersToClientCarriers(apiCarriers);
      setCarriers(clientCarriers);
    };

    fetchData();
  }, []);

  const handleSubmit = async (carrier: VpnCarrier) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', carrier);
    const callbacks = callbackUtils.getCallbacks;

    await callbacks.editVpnCarrier(carrier);
    // eslint-disable-next-line no-console
    console.log('site saved: network access added to site');
    onSuccess();
  };

  const handleDelete = async (carrierName: string) => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', carrierName);
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.deleteVpnCarrier(carrierName);
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  if (!carriers) {
    return null;
  }

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <VpnCarrierForm
          carriers={carriers || []}
          carrier={getDefaultCarrier()}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
};

export default CreateCarrierPage;
