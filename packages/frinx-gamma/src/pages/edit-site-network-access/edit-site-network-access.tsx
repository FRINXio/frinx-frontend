import { Box, Button, Container, Flex, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import unwrap from '../../helpers/unwrap';
import Autocomplete2 from '../../components/autocomplete-2/autocomplete-2';
import {
  apiProviderIdentifiersToClientIdentifers,
  apiVpnSitesToClientVpnSite,
} from '../../components/forms/converters';
import SiteNetworkAccessForm from '../../components/forms/site-network-access-form';
import { SiteNetworkAccess, VpnSite } from '../../components/forms/site-types';
import callbackUtils from '../../callback-utils';

// TODO: to be defined
const getBandwidths = async () => {
  return [1000, 2000, 5000, 10000];
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const EditSiteNetAccessPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [selectedNetworkAccess, setSelectedNetworkAccess] = useState<SiteNetworkAccess | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const [bandwiths, setBandwiths] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);

      const profiles = await callbacks.getValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);

      const bandwithsResponse = await getBandwidths();

      setVpnSites(clientVpnSites);
      setBfdProfiles(clientProfiles.bfdIdentifiers);
      setQosProfiles(clientProfiles.qosIdentifiers);
      setBandwiths(bandwithsResponse);
    };

    fetchData();
  }, []);

  const handleSubmit = async (s: VpnSite) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', s);
    const callbacks = callbackUtils.getCallbacks;

    await callbacks.editVpnSite(s);
    // eslint-disable-next-line no-console
    console.log('site saved: network access added to site');
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  const handleSiteChange = (siteId?: string | null) => {
    // eslint-disable-next-line no-console
    console.log('site changed');
    const site = vpnSites?.filter((s) => s.siteId === siteId).pop();
    setSelectedSite(site || null);
    setSelectedNetworkAccess(null);
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', selectedSite, selectedNetworkAccess);
    if (!selectedSite || !selectedNetworkAccess) {
      return;
    }
    const newNetowrkAccesses = selectedSite.siteNetworkAccesses.filter((access) => {
      return access.siteNetworkAccessId !== selectedNetworkAccess.siteNetworkAccessId;
    });

    const newSite = {
      ...selectedSite,
      siteNetworkAccesses: newNetowrkAccesses,
    };
    const callbacks = callbackUtils.getCallbacks;
    const output = callbacks.editVpnSite(newSite);

    // eslint-disable-next-line no-console
    console.log(output);
    onSuccess();
  };

  const handleSiteNetworkChange = (networkAccessId?: string | null) => {
    // eslint-disable-next-line no-console
    console.log('site network change');
    if (!selectedSite) {
      return;
    }
    const networkAccess = selectedSite.siteNetworkAccesses
      .filter((access) => access.siteNetworkAccessId === networkAccessId)
      .pop();
    setSelectedNetworkAccess(networkAccess || null);
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit Site Network Access</Heading>
          <Button
            onClick={handleDelete}
            colorScheme="red"
            isDisabled={selectedNetworkAccess?.siteNetworkAccessId == null}
          >
            Delete
          </Button>
        </Flex>
        {vpnSites && (
          <>
            <FormControl id="selected-site" my={6}>
              <FormLabel>Select site:</FormLabel>
              <Autocomplete2
                items={vpnSites.map((s) => unwrap(s.siteId))}
                selectedItem={selectedSite?.siteId}
                onChange={handleSiteChange}
              />
            </FormControl>
            {selectedSite && (
              <FormControl id="select-network-access" my={6}>
                <FormLabel>Select Network Access:</FormLabel>
                <Autocomplete2
                  items={selectedSite.siteNetworkAccesses.map((access) => access.siteNetworkAccessId)}
                  selectedItem={selectedNetworkAccess?.siteNetworkAccessId}
                  onChange={handleSiteNetworkChange}
                />
              </FormControl>
            )}
            {selectedSite && selectedNetworkAccess && (
              <>
                <SiteNetworkAccessForm
                  mode="add"
                  qosProfiles={qosProfiles}
                  bfdProfiles={bfdProfiles}
                  bandwidths={bandwiths}
                  sites={vpnSites}
                  site={selectedSite}
                  selectedNetworkAccess={selectedNetworkAccess}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default EditSiteNetAccessPage;
