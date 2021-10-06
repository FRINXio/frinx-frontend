import { Box, Button, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import unwrap from '../../helpers/unwrap';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import { DefaultCVlanEnum, VpnService } from '../../components/forms/service-types';
import VpnServiceForm from '../../components/forms/vpn-service-form';
import callbackUtils from '../../callback-utils';

const defaultVpnService: VpnService = {
  customerName: '',
  defaultCVlan: DefaultCVlanEnum.L3VPN,
  vpnServiceTopology: 'any-to-any',
  maximumRoutes: 1000,
  extranetVpns: [],
};

const extranetVpns = ['MGMT', 'SIP889'];

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateVpnServicePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [selectedService, setSelectedService] = useState<VpnService>(defaultVpnService);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const services = await callbacks.getVpnServices();
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
    };

    fetchData();
  }, []);

  const handleSubmit = (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
    const callbacks = callbackUtils.getCallbacks;
    const output = callbacks.editVpnServices(service);
    // eslint-disable-next-line no-console
    console.log(output);
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', selectedService);
    const callbacks = callbackUtils.getCallbacks;
    const output = callbacks.deleteVpnService(unwrap(selectedService.vpnId));
    // eslint-disable-next-line no-console
    console.log(output);
    onSuccess();
  };

  const handleServiceChange = (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('customer name change', service);
    setSelectedService(service);
  };

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
