import React, { FC, useEffect, useState } from 'react';
import { Container, Box, Heading } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { getVpnSites, editVpnSite, getValidProviderIdentifiers } from '../../../api/unistore/unistore';
import { generateNetworkAccessId } from '../../../api/uniresource/uniresource';
import { apiVpnSitesToClientVpnSite, apiProviderIdentifiersToClientIdentifers } from '../../forms/converters';
import { VpnSite, SiteNetworkAccess, AccessPriority } from '../../forms/site-types';
import SiteNetworkAccessForm from '../../forms/site-network-access-form';
// import SiteInfo from './site-info';
import Autocomplete2 from '../../autocomplete-2/autocomplete-2';
import unwrap from '../../../helpers/unwrap';

const getDefaultNetworkAccess = (): SiteNetworkAccess => ({
  siteNetworkAccessId: generateNetworkAccessId(),
  siteNetworkAccessType: 'point-to-point',
  maximumRoutes: 1000,
  accessPriority: AccessPriority['Primary Ethernet'],
  locationReference: null,
  deviceReference: null,
  routingProtocols: [
    {
      type: 'static',
      vrrp: 'ipv4',
      bgp: {
        addressFamily: 'ipv4',
        autonomousSystem: 0,
        bgpProfile: null,
      },
      static: [
        {
          lanTag: 'lan',
          lan: '10.0.0.1/0',
          nextHop: '10.0.0.3',
        },
      ],
    },
  ],
});

const CreateSiteNetAccessPage: FC = () => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      // TODO: we can fetch all in promise all?
      const sites = await getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);

      const profiles = await getValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);

      setVpnSites(clientVpnSites);
      setBfdProfiles(clientProfiles.bfdIdentifiers);
      setQosProfiles(clientProfiles.qosIdentifiers);
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
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create Site Network Access</Heading>
        {vpnSites && (
          <>
            <Autocomplete2
              items={vpnSites.map((s) => unwrap(s.siteId))}
              selectedItem={selectedSite?.siteId}
              onChange={handleSiteChange}
            />
            {selectedSite && (
              <>
                {/* <SiteInfo site={selectedSite} /> */}
                <SiteNetworkAccessForm
                  mode="add"
                  qosProfiles={qosProfiles}
                  bfdProfiles={bfdProfiles}
                  sites={vpnSites}
                  site={selectedSite}
                  selectedNetworkAccess={getDefaultNetworkAccess()}
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

export default CreateSiteNetAccessPage;
