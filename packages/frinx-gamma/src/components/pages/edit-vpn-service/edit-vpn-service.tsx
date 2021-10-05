import React, { FC, useEffect, useState } from 'react';
import { Container, Box, Flex, Heading, Button, FormControl, FormLabel } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import VpnServiceForm from '../../forms/vpn-service-form';
import Autocomplete2 from '../../autocomplete-2/autocomplete-2';
// import Autocomplete from '../../autocomplete/autocomplete';
import { VpnService } from '../../forms/service-types';
import { getVpnServices, editVpnServices, deleteVpnService } from '../../../api/unistore/unistore';
import { apiVpnServiceToClientVpnService } from '../../forms/converters';
import unwrap from '../../../helpers/unwrap';

const extranetVpns = ['MGMT', 'SIP889'];

const CreateVpnServicePage: FC = () => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [selectedService, setSelectedService] = useState<VpnService | null>(null);
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
    const output = editVpnServices(service);
    // eslint-disable-next-line no-console
    console.log(output);
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
    if (!selectedService) {
      return;
    }
    deleteVpnService(unwrap(selectedService.vpnId));
    // eslint-disable-next-line no-console
    history.push('/');
  };

  const handleServiceChange = (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('customer changed');
    setSelectedService(service);
  };

  const handleVpnIdChange = (vpnId?: string | null) => {
    if (!vpnServices) {
      return;
    }
    const [newService] = vpnServices.filter((s) => s.vpnId === vpnId);
    setSelectedService(newService);
  };

  // TODO: add some loading state
  if (!vpnServices) {
    return null;
  }

  const vpnIds = vpnServices.map((s) => unwrap(s.vpnId));

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit VPN Service</Heading>
          <Button onClick={handleDelete} colorScheme="red" isDisabled={selectedService?.vpnId == null}>
            Delete
          </Button>
        </Flex>
        <FormControl id="vpnId" my={6}>
          <FormLabel>Vpn ID</FormLabel>
          <Autocomplete2 items={vpnIds} selectedItem={selectedService?.vpnId} onChange={handleVpnIdChange} />
        </FormControl>
        {vpnServices && selectedService && (
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
