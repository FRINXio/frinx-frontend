import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiVpnServiceToClientVpnService, clientVpnServiceToApiVpnService } from '../../components/forms/converters';
import { VpnService } from '../../components/forms/service-types';
import VpnServiceForm from '../../components/forms/vpn-service-form';
import ErrorMessage from '../../components/error-message/error-message';
import callbackUtils from '../../unistore-callback-utils';
import unwrap from '../../helpers/unwrap';
import { getSelectOptions } from '../../components/forms/options.helper';
import useCalcDiffContext from '../../providers/calcdiff-provider/use-calcdiff-context';

const extranetVpns = getSelectOptions(window.__GAMMA_FORM_OPTIONS__.service.extranet_vpns).map((item) => item.key);

function getSelectedService(services: VpnService[], serviceId: string): VpnService {
  const [vpnService] = services.filter((s) => unwrap(s.vpnId) === serviceId);
  return vpnService;
}

const EditVpnServicePage: VoidFunctionComponent = () => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const { serviceId } = useParams<{ serviceId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { invalidateCache } = useCalcDiffContext();

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
    setSubmitError(null);
    try {
      const callbacks = callbackUtils.getCallbacks;
      const vpnService = clientVpnServiceToApiVpnService(service);
      await callbacks.editVpnServices(vpnService);
      invalidateCache();
      navigate('../services');
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    navigate('../services');
  };

  // TODO: add some loading state
  if (!vpnServices) {
    return null;
  }

  const selectedService = getSelectedService(vpnServices, unwrap(serviceId));

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit VPN Service</Heading>
        </Flex>
        {submitError && <ErrorMessage text={String(submitError)} />}
        {vpnServices && selectedService && (
          <VpnServiceForm
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

export default EditVpnServicePage;
