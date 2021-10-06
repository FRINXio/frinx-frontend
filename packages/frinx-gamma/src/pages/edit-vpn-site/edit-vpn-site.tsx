import { Box, Button, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import unwrap from '../../helpers/unwrap';
import {
  apiVpnSitesToClientVpnSite,
  apiProviderIdentifiersToClientIdentifers,
} from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import VpnSiteForm from '../../components/forms/vpn-site-form';
import callbackUtils from '../../callback-utils';

const getDefaultVpnSite = (): VpnSite => ({
  customerLocations: [],
  siteDevices: [],
  siteManagementType: 'provider-managed',
  siteVpnFlavor: 'site-vpn-flavor-single',
  siteServiceQosProfile: '',
  enableBgpPicFastReroute: false,
  siteNetworkAccesses: [],
  maximumRoutes: 1000,
});

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const EditVpnSitePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite>(getDefaultVpnSite());
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const sites = await callbacks.getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setVpnSites(clientVpnSites);

      const profiles = await callbacks.getValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);
      setQosProfiles(clientProfiles.qosIdentifiers);
    };

    fetchData();
  }, []);

  const handleSubmit = async (site: VpnSite) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', site);
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.editVpnSite(site);
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', selectedSite);
    const callbacks = callbackUtils.getCallbacks;
    const output = callbacks.deleteVpnSite(unwrap(selectedSite.siteId));
    // eslint-disable-next-line no-console
    console.log(output);
    onSuccess();
  };

  const handleSiteChange = (site: VpnSite) => {
    // eslint-disable-next-line no-console
    console.log('site change', site);
    setSelectedSite(site);
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit VPN Site</Heading>
          <Button onClick={handleDelete} colorScheme="red" isDisabled={!selectedSite}>
            Delete
          </Button>
        </Flex>
        {vpnSites && (
          <VpnSiteForm
            mode="edit"
            sites={vpnSites}
            site={selectedSite}
            qosProfiles={qosProfiles}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onSiteChange={handleSiteChange}
          />
        )}
      </Box>
    </Container>
  );
};

export default EditVpnSitePage;
