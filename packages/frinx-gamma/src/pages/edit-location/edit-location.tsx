import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import callbackUtils from '../../callback-utils';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import CustomerLocationForm from '../../components/forms/customer-location-form';
import { CustomerLocation, VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

const EditLocationPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const { siteId, locationId } = useParams<{ siteId: string; locationId: string }>();

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
    if (!selectedSite) {
      return;
    }
    const oldLocations = [...selectedSite.customerLocations];
    const newLocations = oldLocations.map((oldLocation) => {
      return oldLocation.locationId === location.locationId ? location : oldLocation;
    });
    const editedSite: VpnSite = {
      ...selectedSite,
      customerLocations: newLocations,
    };
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.editVpnSite(editedSite);
    onSuccess(unwrap(siteId));
  };

  const location = selectedSite?.customerLocations.find((l) => l.locationId === locationId);

  if (!location) {
    return null;
  }

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create customer location</Heading>
        <CustomerLocationForm
          location={location}
          buttonText="Edit location"
          onSubmit={handleFormSubmit}
          onCancel={() => {
            onCancel(siteId);
          }}
        />
      </Box>
    </Container>
  );
};

export default EditLocationPage;
