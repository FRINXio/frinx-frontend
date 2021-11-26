import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import { v4 as uuid4 } from 'uuid';
import callbackUtils from '../../unistore-callback-utils';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import CustomerLocationForm from '../../components/forms/customer-location-form';
import { CustomerLocation, VpnSite } from '../../components/forms/site-types';
import ErrorMessage from '../../components/error-message/error-message';
import unwrap from '../../helpers/unwrap';

const getDefaultLocation = (): CustomerLocation => {
  return {
    locationId: '',
    city: '',
    countryCode: 'UK',
    postalCode: '',
    state: '',
    street: '',
  };
};

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

const CreateLocationPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const { siteId } = useParams<{ siteId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setSelectedSite(getSelectedSite(clientVpnSites, siteId));
    };

    fetchData();
  }, [siteId]);

  const handleFormSubmit = async (location: CustomerLocation) => {
    setSubmitError(null);
    if (!selectedSite) {
      return;
    }
    const newLocation = {
      ...location,
      locationId: uuid4(),
    };
    const newLocations = [...selectedSite.customerLocations, newLocation];
    const editedSite: VpnSite = {
      ...selectedSite,
      customerLocations: newLocations,
    };
    const callbacks = callbackUtils.getCallbacks;
    try {
      await callbacks.editVpnSite(editedSite);
      onSuccess(unwrap(siteId));
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create customer location</Heading>
        {submitError && <ErrorMessage text={String(submitError)} />}
        <CustomerLocationForm
          location={getDefaultLocation()}
          buttonText="Create location"
          onSubmit={handleFormSubmit}
          onCancel={() => {
            onCancel(siteId);
          }}
        />
      </Box>
    </Container>
  );
};

export default CreateLocationPage;
