import React, { FC, useEffect, useState } from 'react';
import { Container, Box, Heading } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import VpnServiceForm from '../../forms/vpn-service-form';
import { DefaultCVlanEnum, VpnService } from '../../forms/service-types';
import { getVpnServices, putVpnServices } from '../../../api/unistore/unistore';
import { generateVpnId } from '../../../api/uniresource/uniresource';
import { apiVpnServiceToClientVpnService } from '../../forms/converters';

const defaultVpnService: VpnService = {
  customerName: '',
  defaultCVlan: DefaultCVlanEnum.L3VPN,
  vpnServiceTopology: 'any-to-any',
  maximumRoutes: 1000,
  extranetVpns: [],
};

const extranetVpns = ['MGMT', 'SIP889'];

const CreateVpnServicePage: FC = () => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const services = await getVpnServices();
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
    };

    fetchData();
  }, []);

  const handleSubmit = async (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
    // eslint-disable-next-line no-param-reassign
    service.vpnId = await generateVpnId();
    const output = putVpnServices(service);
    // eslint-disable-next-line no-console
    console.log(output);
    history.push('/');
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    history.push('/');
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Service</Heading>
        {vpnServices && (
          <VpnServiceForm
            mode="add"
            services={vpnServices}
            service={defaultVpnService}
            onSubmit={handleSubmit}
            extranetVpns={extranetVpns}
            onCancel={handleCancel}
          />
        )}
      </Box>
    </Container>
  );
};

export default CreateVpnServicePage;
