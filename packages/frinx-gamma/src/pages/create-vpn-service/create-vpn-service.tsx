import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import { DefaultCVlanEnum, VpnService } from '../../components/forms/service-types';
import VpnServiceForm from '../../components/forms/vpn-service-form';
import { generateVpnId } from '../../helpers/id-helpers';

const defaultVpnService: VpnService = {
  customerName: '',
  defaultCVlan: DefaultCVlanEnum['Main Corporate VPN'],
  vpnServiceTopology: 'any-to-any',
  extranetVpns: [],
};

const extranetVpns = ['MGMT', 'SIP889'];

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateVpnServicePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const services = await callbacks.getVpnServices(null, null);
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: VpnService) => {
    const service = {
      ...data,
      vpnId: generateVpnId(),
    };
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
    const callbacks = callbackUtils.getCallbacks;
    const output = await callbacks.createVpnService(service);
    // eslint-disable-next-line no-console
    console.log(output);
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
