import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router';
import unwrap from '../../helpers/unwrap';
import { apiBearerToClientBearer, apiProviderIdentifiersToClientIdentifers } from '../../components/forms/converters';
import callbackUtils from '../../callback-utils';
import { EvcAttachment, VpnBearer } from '../../components/forms/bearer-types';
import EvcAttachmentForm from '../../components/forms/evc-attachment-form';
import { getRandomInt } from '../../helpers/id-helpers';

const getDefaultEvcAttachment = (): EvcAttachment => ({
  carrierReference: null,
  circuitReference: '',
  customerName: null,
  evcType: 'evc-point-to-point',
  inputBandwidth: 1000,
  qosInputProfile: null,
  status: null,
  svlanId: getRandomInt(1000), // https://frinxhelpdesk.atlassian.net/browse/GAM-80
  upstreamBearer: null,
});

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedBearer(bearers: VpnBearer[], bearerId: string): VpnBearer {
  const [vpnBearer] = bearers.filter((b) => b.spBearerReference === bearerId);
  return vpnBearer;
}

const CreateEvcAttachmentPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [selectedBearer, setSelectedBearer] = useState<VpnBearer | null>(null);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const { bearerId } = useParams<{ bearerId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
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

    await callbacks.editVpnBearer(editedBearer);
    // eslint-disable-next-line no-console
    console.log('bearer saved: evc attachment added to bearer');
    onSuccess(unwrap(bearerId));
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedBearer?.spBearerReference));
  };

  return (
    selectedBearer && (
      <Container>
        <Box padding={6} margin={6} background="white">
          <Heading size="md">Add Evc Attachment To Bearer: {bearerId} </Heading>
          <EvcAttachmentForm
            qosProfiles={qosProfiles}
            evcAttachment={getDefaultEvcAttachment()}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Container>
    )
  );
};

export default CreateEvcAttachmentPage;
