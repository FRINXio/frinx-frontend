import React, { FC, useEffect, useState } from 'react';
import { Container, Flex, Button, Box, Heading, FormControl, FormLabel } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { getVpnSites, editVpnSite, getValidProviderIdentifiers } from '../../../api/unistore/unistore';
import { apiVpnSitesToClientVpnSite, apiProviderIdentifiersToClientIdentifers } from '../../forms/converters';
import { VpnSite, SiteNetworkAccess } from '../../forms/site-types';
import SiteNetworkAccessForm from '../../forms/site-network-access-form';
import Autocomplete2 from '../../autocomplete-2/autocomplete-2';
import unwrap from '../../../helpers/unwrap';

// TODO: to be defined
const getBandwidths = async () => {
  return [1000, 2000, 5000, 10000];
};

const EditSiteNetAccessPage: FC = () => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [selectedNetworkAccess, setSelectedNetworkAccess] = useState<SiteNetworkAccess | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const [bandwiths, setBandwiths] = useState<number[]>([]);

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      // TODO: we can fetch all in promise all?
      const sites = await getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);

      const profiles = await getValidProviderIdentifiers();
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

    await editVpnSite(s);
    // eslint-disable-next-line no-console
    console.log('site saved: network access added to site');
    history.push('/');
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    history.push('/');
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
    const output = editVpnSite(newSite);

    // eslint-disable-next-line no-console
    console.log(output);
    history.push('/');
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
