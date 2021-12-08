import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../unistore-callback-utils';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import { getSelectOptions } from '../../components/forms/options.helper';
import { DefaultCVlanEnum, VpnService } from '../../components/forms/service-types';
import VpnServiceForm from '../../components/forms/vpn-service-form';
import ErrorMessage from '../../components/error-message/error-message';
import { generateVpnId } from '../../helpers/id-helpers';
import PollWorkflowId from '../../components/poll-workflow-id/poll-worfklow-id';

const defaultVpnService: VpnService = {
  customerName: '',
  defaultCVlan: DefaultCVlanEnum['Main Corporate VPN'],
  vpnServiceTopology: 'any-to-any',
  extranetVpns: [],
};

const extranetVpns = getSelectOptions(window.__GAMMA_FORM_OPTIONS__.service.extranet_vpns).map((item) => item.label);

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateVpnServicePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [vpnId, setVpnId] = useState<string | null>(null);
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
      const workflowResult = await uniflowCallbacks.executeWorkflow({
        name: 'Allocate_VpnServiceId',
        version: 1,
        input: {},
      });
      setWorkflowId(workflowResult.text);
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
      vpnId: generateVpnId(),
    };
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
    const callbacks = callbackUtils.getCallbacks;
    try {
      const output = await callbacks.editVpnServices(service);
      // eslint-disable-next-line no-console
      console.log(output);
      onSuccess();
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  if (!workflowId) {
    return null;
  }

  if (!vpnId) {
    return <PollWorkflowId workflowId={workflowId} onFinish={setVpnId} />;
  }

  const vpnService = { ...defaultVpnService, vpnId };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Service</Heading>
        {submitError && <ErrorMessage text={String(submitError)} />}
        {vpnServices && (
          <VpnServiceForm
            mode="add"
            services={vpnServices}
            service={vpnService}
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
