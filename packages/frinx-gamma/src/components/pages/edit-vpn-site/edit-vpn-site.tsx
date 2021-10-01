import React, { FC, useEffect, useState } from 'react';
import { Flex, Button, Container, Box, Heading } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import VpnSiteForm from '../../forms/vpn-site-form';
import { getVpnSites, deleteVpnSite, editVpnSite } from '../../../api/unistore/unistore';
import { apiVpnSitesToClientVpnSite } from '../../forms/converters';
import { VpnSite } from '../../forms/site-types';
import unwrap from '../../../helpers/unwrap';

const getDefaultVpnSite = (): VpnSite => ({
  customerLocations: [],
  siteDevices: [],
  siteManagementType: 'provider-managed',
  siteVpnFlavor: 'site-vpn-flavor-single',
  siteServiceQosProfile: '',
  enableBgpPicFastReroute: false,
  siteNetworkAccesses: [],
});

const EditVpnSitePage: FC = () => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite>(getDefaultVpnSite());
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const sites = await getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setVpnSites(clientVpnSites);
    };

    fetchData();
  }, []);

  const handleSubmit = async (site: VpnSite) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', site);
    await editVpnSite(site);
    history.push('/');
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    history.push('/');
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-console
    console.log('delete clicked', selectedSite);
    const output = deleteVpnSite(unwrap(selectedSite.siteId));
    // eslint-disable-next-line no-console
    console.log(output);
    history.push('/');
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
