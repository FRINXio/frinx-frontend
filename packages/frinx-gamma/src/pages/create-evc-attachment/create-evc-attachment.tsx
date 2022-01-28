import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router';
import unwrap from '../../helpers/unwrap';
import {
  apiBearerToClientBearer,
  apiProviderIdentifiersToClientIdentifers,
  clientBearerToApiBearer,
} from '../../components/forms/converters';
import callbackUtils from '../../unistore-callback-utils';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { EvcAttachment, VpnBearer } from '../../components/forms/bearer-types';
import EvcAttachmentForm from '../../components/forms/evc-attachment-form';
import ErrorMessage from '../../components/error-message/error-message';
import { asyncGenerator } from '../../components/commit-status-modal/commit-status-modal.helpers';

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
  const [isLoadingSvlan, setIsLoadingSvlan] = useState<boolean>(false);
  const [svlanId, setSvlanId] = useState<number | null>(null);
  const [selectedBearer, setSelectedBearer] = useState<VpnBearer | null>(null);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const { bearerId } = useParams<{ bearerId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: we can fetch all in promise all?
      const callbacks = callbackUtils.getCallbacks;
      const bearers = await callbacks.getVpnBearers(null, null);
      const clientVpnBearers = apiBearerToClientBearer(bearers);
      const bearer = getSelectedBearer(clientVpnBearers, bearerId);
      setSelectedBearer(bearer);

      const profiles = await callbacks.getBearerValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);
      setQosProfiles(clientProfiles.qosIdentifiers);
    };

    fetchData();
  }, [bearerId]);

  useEffect(() => {
    // free resource on unmount
    return () => {
      if (!selectedBearer?.spBearerReference || !svlanId) {
        return;
      }
      const freeResources = async () => {
        const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
        await uniflowCallbacks.executeWorkflow({
          name: 'Free_SvlanId',
          version: 1,
          input: {
            sp_bearer_reference: selectedBearer?.spBearerReference, // eslint-disable-line @typescript-eslint/naming-convention
            vlan: svlanId,
          },
        });
      };

      freeResources();
    };
  }, [selectedBearer, svlanId]);

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
      const apiBearer = clientBearerToApiBearer(editedBearer);
      await callbacks.editVpnBearer(apiBearer);
      // eslint-disable-next-line no-console
      console.log('bearer saved: evc attachment added to bearer');
      onSuccess(unwrap(bearerId));
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = async () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedBearer?.spBearerReference));
  };

  const handleWorkflowFinish = () => {
    setIsLoadingSvlan(false);
  };

  const handleSvlanAssign = async () => {
    setIsLoadingSvlan(true);
    const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
    const workflowResult = await uniflowCallbacks.executeWorkflow({
      name: 'Allocate_SvlanId',
      version: 1,
      input: {
        sp_bearer_reference: bearerId, // eslint-disable-line @typescript-eslint/naming-convention
      },
    });

    const controller = new AbortController();

    // eslint-disable-next-line no-restricted-syntax
    for await (const data of asyncGenerator<SvlanWorkflowData>({
      workflowId: workflowResult.text,
      abortController: controller,
      onFinish: handleWorkflowFinish,
    })) {
      if (data.result.status === 'COMPLETED') {
        const { vlan } = data.result.output.response_body;
        setSvlanId(vlan);
      }
    }
  };

  const evcAttachment = { ...getDefaultEvcAttachment(), svlanId };

  return (
    <>
      {selectedBearer && (
        <Container>
          <Box padding={6} margin={6} background="white">
            <Heading size="md">Add Evc Attachment To Bearer: {bearerId} </Heading>
            {submitError && <ErrorMessage text={String(submitError)} />}
            <EvcAttachmentForm
              qosProfiles={qosProfiles}
              evcAttachment={evcAttachment}
              onSvlanAssign={handleSvlanAssign}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoadingSvlan={isLoadingSvlan}
            />
          </Box>
          {/* {workflowId && <PollWorkflowId workflowId={workflowId} onFinish={handleWorkflowFinish} />} */}
        </Container>
      )}
    </>
  );
};

export default CreateEvcAttachmentPage;
