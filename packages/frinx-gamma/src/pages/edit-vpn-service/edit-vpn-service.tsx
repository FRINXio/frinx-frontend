import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import { VpnService } from '../../components/forms/service-types';
import VpnServiceForm from '../../components/forms/vpn-service-form';
import callbackUtils from '../../callback-utils';
import unwrap from '../../helpers/unwrap';

const extranetVpns = ['MGMT', 'SIP889'];

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

function getSelectedService(services: VpnService[], serviceId: string): VpnService {
  const [vpnService] = services.filter((s) => unwrap(s.vpnId) === serviceId);
  return vpnService;
}

const CreateVpnServicePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const { serviceId } = useParams<{ serviceId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const services = await callbacks.getVpnServices(null, null);
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
    };

    fetchData();
  }, []);

  const handleSubmit = async (service: VpnService) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.editVpnServices(service);
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  // TODO: add some loading state
  if (!vpnServices) {
    return null;
  }

  const selectedService = getSelectedService(vpnServices, serviceId);

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit VPN Service</Heading>
        </Flex>
        {vpnServices && selectedService && (
          <VpnServiceForm
            mode="edit"
            services={vpnServices}
            service={selectedService}
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
