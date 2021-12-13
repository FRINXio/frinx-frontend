import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router';
import unwrap from '../../helpers/unwrap';
import { apiBearerToClientBearer, apiProviderIdentifiersToClientIdentifers } from '../../components/forms/converters';
import callbackUtils from '../../unistore-callback-utils';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { EvcAttachment, VpnBearer } from '../../components/forms/bearer-types';
import EvcAttachmentForm from '../../components/forms/evc-attachment-form';
import ErrorMessage from '../../components/error-message/error-message';
import PollWorkflowId from '../../components/poll-workflow-id/poll-worfklow-id';

const getDefaultEvcAttachment = (): EvcAttachment => ({
  carrierReference: null,
  circuitReference: '',
  customerName: null,
  evcType: 'evc-point-to-point',
  inputBandwidth: 1000,
  qosInputProfile: null,
  status: null,
  svlanId: 0, // https://frinxhelpdesk.atlassian.net/browse/GAM-80
  upstreamBearer: null,
});

type SvlanWorkflowData = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  response_body: {
    vlan: number;
  };
};

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedBearer(bearers: VpnBearer[], bearerId: string): VpnBearer {
  const [vpnBearer] = bearers.filter((b) => b.spBearerReference === bearerId);
  return vpnBearer;
}

const CreateEvcAttachmentPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [svlanId, setSvlanId] = useState<number | null>(null);
  const [selectedBearer, setSelectedBearer] = useState<VpnBearer | null>(null);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const { bearerId } = useParams<{ bearerId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: we can fetch all in promise all?
      const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
      const workflowResult = await uniflowCallbacks.executeWorkflow({
        name: 'Allocate_SvlanId',
        version: 1,
        input: {},
      });
      setWorkflowId(workflowResult.text);

      const callbacks = callbackUtils.getCallbacks;
      const bearers = await callbacks.getVpnBearers(null, null);
      const clientVpnBearers = apiBearerToClientBearer(bearers);
      setSelectedBearer(getSelectedBearer(clientVpnBearers, bearerId));

      const profiles = await callbacks.getBearerValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);
      setQosProfiles(clientProfiles.qosIdentifiers);
    };

    fetchData();
  }, [bearerId]);

  const handleSubmit = async (attachment: EvcAttachment) => {
    setSubmitError(null);
    if (!selectedBearer) {
      return;
    }

    const newBearers = [...selectedBearer.evcAttachments, attachment];
    const editedBearer: VpnBearer = {
      ...selectedBearer,
      evcAttachments: newBearers,
    };
    // eslint-disable-next-line no-console
    console.log('submit clicked', editedBearer);
    const callbacks = callbackUtils.getCallbacks;

    try {
      await callbacks.editVpnBearer(editedBearer);
      // eslint-disable-next-line no-console
      console.log('bearer saved: evc attachment added to bearer');
      onSuccess(unwrap(bearerId));
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedBearer?.spBearerReference));
  };

  const handleWorkflowFinish = (data: string | null) => {
    if (data === null) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { response_body }: SvlanWorkflowData = JSON.parse(data);
    setSvlanId(Number(response_body.vlan));
  };

  if (!workflowId) {
    return null;
  }

  if (!svlanId) {
    return <PollWorkflowId workflowId={workflowId} onFinish={handleWorkflowFinish} />;
  }

  const evcAttachment = { ...getDefaultEvcAttachment(), svlanId };

  return (
    selectedBearer && (
      <Container>
        <Box padding={6} margin={6} background="white">
          <Heading size="md">Add Evc Attachment To Bearer: {bearerId} </Heading>
          {submitError && <ErrorMessage text={String(submitError)} />}
          <EvcAttachmentForm
            qosProfiles={qosProfiles}
            evcAttachment={evcAttachment}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Container>
    )
  );
};

export default CreateEvcAttachmentPage;
