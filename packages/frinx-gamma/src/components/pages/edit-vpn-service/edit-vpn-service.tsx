import React, { FC, useEffect, useState, useMemo } from 'react';
import { Container, Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import VpnServiceForm from '../../forms/vpn-service-form';
import { DefaultCVlanEnum, VpnService } from '../../forms/service-types';
import { getVpnServices } from '../../../api/unistore/unistore';
import { apiVpnServiceToClientVpnService } from '../../forms/converters';

const defaultVpnService: VpnService = {
  customerName: '',
  defaultCVlan: DefaultCVlanEnum.L3VPN,
  vpnServiceTopology: 'any-any',
  maximumRoutes: 1000,
  extranetVpns: [],
};

const extranetVpns = ['MGMT', 'SIP889'];

const CreateVpnServicePage: FC = () => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [selectedService, setSelectedService] = useState<VpnService>(defaultVpnService);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const services = await getVpnServices();
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
    };

    fetchData();
  }, []);

  const handleSubmit = (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
    history.push('/');
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    history.push('/');
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', selectedService);
    history.push('/');
  };

  const handleServiceChange = (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('customer name change', service);
    setSelectedService(service);
  };

  console.log('render form');

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit VPN Service</Heading>
          <Button onClick={handleDelete} colorScheme="red" isDisabled={selectedService.vpnId == null}>
            Delete
          </Button>
        </Flex>
        {vpnServices && (
          <VpnServiceForm
            mode="edit"
            services={vpnServices}
            service={selectedService}
            onSubmit={handleSubmit}
            extranetVpns={extranetVpns}
            onCancel={handleCancel}
            onServiceChange={handleServiceChange}
          />
        )}
      </Box>
    </Container>
  );
};

export default CreateVpnServicePage;
