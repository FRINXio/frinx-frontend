import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import callbackUtils from '../../unistore-callback-utils';
import { apiVpnSitesToClientVpnSite, clientVpnSiteToApiVpnSite } from '../../components/forms/converters';
import CustomerLocationForm from '../../components/forms/customer-location-form';
import { CustomerLocation, VpnSite } from '../../components/forms/site-types';
import ErrorMessage from '../../components/error-message/error-message';
import unwrap from '../../helpers/unwrap';
import { generateLocationId } from '../../helpers/id-helpers';

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

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

const CreateLocationPage: VoidFunctionComponent = () => {
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const { siteId } = useParams<{ siteId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setSelectedSite(getSelectedSite(clientVpnSites, unwrap(siteId)));
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
      locationId: generateLocationId(),
    };
    const newLocations = [...selectedSite.customerLocations, newLocation];
    const editedSite: VpnSite = {
      ...selectedSite,
      customerLocations: newLocations,
    };
    const callbacks = callbackUtils.getCallbacks;
    try {
      const apiSite = clientVpnSiteToApiVpnSite(editedSite);
      await callbacks.editVpnSite(apiSite);
      navigate(`../sites/${siteId}/locations`);
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
          siteId={unwrap(siteId)}
          location={getDefaultLocation()}
          buttonText="Create location"
          onSubmit={handleFormSubmit}
        />
      </Box>
    </Container>
  );
};

export default CreateLocationPage;
