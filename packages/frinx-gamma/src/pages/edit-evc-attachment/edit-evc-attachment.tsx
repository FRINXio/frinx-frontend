import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import unwrap from '../../helpers/unwrap';
import {
  apiBearerToClientBearer,
  apiProviderIdentifiersToClientIdentifers,
  clientBearerToApiBearer,
} from '../../components/forms/converters';
import callbackUtils from '../../unistore-callback-utils';
import { EvcAttachment, VpnBearer } from '../../components/forms/bearer-types';
import EvcAttachmentForm from '../../components/forms/evc-attachment-form';
import ErrorMessage from '../../components/error-message/error-message';

function getSelectedBearer(bearers: VpnBearer[], bearerId: string): VpnBearer {
  const [vpnBearer] = bearers.filter((b) => b.spBearerReference === bearerId);
  return vpnBearer;
}

function getSelectedEvcAttachment(bearer: VpnBearer, evcType: string, circuitReference: string) {
  const [evcAttachment] = bearer.evcAttachments.filter(
    (a) => a.evcType === evcType && a.circuitReference === circuitReference,
  );
  return evcAttachment;
}

const EditEvcAttachmentPage: VoidFunctionComponent = () => {
  const [selectedBearer, setSelectedBearer] = useState<VpnBearer | null>(null);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const { bearerId, evcType, circuitReference } =
    useParams<{ bearerId: string; evcType: string; circuitReference: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const bearers = await callbacks.getVpnBearers(null, null);
      const clientVpnBearers = apiBearerToClientBearer(bearers);
      setSelectedBearer(getSelectedBearer(clientVpnBearers, unwrap(bearerId)));

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

    const oldAttachments = [...selectedBearer.evcAttachments];
    const newAttachments = oldAttachments.map((oldAttachment) => {
      return oldAttachment.evcType === evcType && oldAttachment.circuitReference === circuitReference
        ? attachment
        : oldAttachment;
    });

    const editedBearer: VpnBearer = {
      ...selectedBearer,
      evcAttachments: newAttachments,
    };

    // eslint-disable-next-line no-console
    console.log('submit clicked', editedBearer);
    const callbacks = callbackUtils.getCallbacks;

    try {
      const apiBearer = clientBearerToApiBearer(editedBearer);
      await callbacks.editVpnBearer(apiBearer);
      // eslint-disable-next-line no-console
      console.log('bearer saved: evc attachment added to bearer');
      navigate(`../vpn-bearers/${bearerId}/evc-attachments`);
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    navigate(`../vpn-bearers/${bearerId}/evc-attachments`);
  };

  if (!selectedBearer) {
    return null;
  }

  const selectedEvcAttachment = getSelectedEvcAttachment(selectedBearer, unwrap(evcType), unwrap(circuitReference));

  return (
    selectedBearer && (
      <Container>
        <Box padding={6} margin={6} background="white">
          <Heading size="md">Edit Evc Attachment: {bearerId} </Heading>
          {submitError && <ErrorMessage text={String(submitError)} />}
          <EvcAttachmentForm
            qosProfiles={qosProfiles}
            evcAttachment={selectedEvcAttachment}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onReset={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
            isLoadingSvlan={false}
          />
        </Box>
      </Container>
    )
  );
};

export default EditEvcAttachmentPage;
