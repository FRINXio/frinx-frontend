import React, { FC, useEffect, useState } from 'react';
import { Container, Box, Heading } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import VpnSiteForm from '../../forms/vpn-site-form';
import { getVpnSites } from '../../../api/unistore/unistore';
import { apiVpnSiteToClientVpnSite } from '../../forms/converters';
import { VpnSite } from '../../forms/site-types';

const defaultVpnSite: VpnSite = {
  customerLocations: [],
  siteDevices: [],
  siteManagementType: 'provider-managed',
  siteVpnFlavor: 'single',
  siteServiceQosProfile: '',
  enableBgpPicFastReroute: 'no',
};

const CreateVpnSitePage: FC = () => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const sites = await getVpnSites();
      const clientVpnSites = apiVpnSiteToClientVpnSite(sites);
      setVpnSites(clientVpnSites);
    };

    fetchData();
  }, []);

  const handleSubmit = (service: VpnSite) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', service);
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
