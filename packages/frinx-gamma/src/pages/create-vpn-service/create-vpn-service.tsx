import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useContext, useEffect, useState, VoidFunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import callbackUtils from '../../unistore-callback-utils';
import { apiVpnServiceToClientVpnService, clientVpnServiceToApiVpnService } from '../../components/forms/converters';
import { getSelectOptions } from '../../components/forms/options.helper';
import { DefaultCVlanEnum, VpnService } from '../../components/forms/service-types';
import VpnServiceForm from '../../components/forms/vpn-service-form';
import ErrorMessage from '../../components/error-message/error-message';
import { CalcDiffContext } from '../../providers/calcdiff-provider/calcdiff-provider';
import unwrap from '../../helpers/unwrap';

const defaultVpnService: VpnService = {
  customerName: '',
  defaultCVlan: DefaultCVlanEnum['Main Corporate VPN'],
  vpnServiceTopology: 'any-to-any',
  extranetVpns: [],
};

const extranetVpns = getSelectOptions(window.__GAMMA_FORM_OPTIONS__.service.extranet_vpns).map((item) => item.label);

const CreateVpnServicePage: VoidFunctionComponent = () => {
  const calcdiffContext = useContext(CalcDiffContext);
  const { invalidateCache } = unwrap(calcdiffContext);
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    setSubmitError(null);
    const service = {
      ...data,
    };
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
    const callbacks = callbackUtils.getCallbacks;
    try {
      const vpnService = clientVpnServiceToApiVpnService(service);
      const output = await callbacks.createVpnService(vpnService);
      // eslint-disable-next-line no-console
      console.log(output);
      invalidateCache();
      navigate('../services');
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = async () => {
    console.log('cancel clicked'); // eslint-disable-line no-console
    navigate('../services');
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Service</Heading>
        {submitError && <ErrorMessage text={String(submitError)} />}
        {vpnServices && (
          <VpnServiceForm
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
