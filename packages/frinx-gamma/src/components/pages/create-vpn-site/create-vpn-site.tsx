import React, { FC, useEffect, useState } from 'react';
import { Container, Box, Heading } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import VpnSiteForm from '../../forms/vpn-site-form';
import { createVpnSite, getVpnSites } from '../../../api/unistore/unistore';
import { generateSiteId } from '../../../api/uniresource/uniresource';
import { apiVpnSitesToClientVpnSite } from '../../forms/converters';
import { VpnSite } from '../../forms/site-types';

const defaultVpnSite: VpnSite = {
  customerLocations: [],
  siteDevices: [],
  siteManagementType: 'provider-managed',
  siteVpnFlavor: 'site-vpn-flavor-single',
  siteServiceQosProfile: '',
  enableBgpPicFastReroute: false,
};

const CreateVpnSitePage: FC = () => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
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
    // eslint-disable-next-line no-param-reassign
    const siteWithId = {
      ...site,
      siteId: generateSiteId(),
    };
    await createVpnSite(siteWithId);
    // eslint-disable-next-line no-console
    console.log('site created');
    history.push('/');
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    history.push('/');
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Site</Heading>
        {vpnSites && (
          <VpnSiteForm mode="add" sites={[]} site={defaultVpnSite} onSubmit={handleSubmit} onCancel={handleCancel} />
        )}
      </Box>
    </Container>
  );
};

export default CreateVpnSitePage;
