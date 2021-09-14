import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';
import VpnServiceForm from '../forms/vpn-service-form';
import { DefaultCVlanEnum, VpnService } from '../forms/service-types';

const Main: FC = () => {
  const vpnService: VpnService = {
    customerName: '',
    defaultCVlan: DefaultCVlanEnum.L3VPN,
    vpnServiceTopology: 'any-any',
    maximumRoutes: 1000,
    extranetVpns: ['vpn1'],
  };

  // const customerNames = [
  //   { value: 'ibm', label: 'IBM' },
  //   { value: 'att', label: 'At&T' },
  //   { value: 'orange', label: 'Orange' },
  //   { value: 'vodafone', label: 'Vodafone' },
  //   { value: 'google', label: 'Google' },
  //   { value: 'Amazon', label: 'Amazon' },
  // ];

  // const extranetVpns = [
  //   { value: 'vpn1', label: 'vpn1' },
  //   { value: 'vpn2', label: 'vpn2' },
  //   { value: 'vpn3', label: 'vpn3' },
  //   { value: 'vpn4', label: 'vpn4' },
  //   { value: 'vpn5', label: 'vpn5' },
  // ];

  const extranetVpns = ['vpn1', 'vpn2', 'vpn3', 'vpn4', 'vpn5'];

  const handleSubmit = (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
  };

  return (
    <Box padding={6} margin={6} background="white">
      <VpnServiceForm
        service={vpnService}
        onSubmit={handleSubmit}
        extranetVpns={extranetVpns}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default Main;
