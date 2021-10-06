import { Box, Container, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import unwrap from '../../helpers/unwrap';
import Autocomplete2, { Item } from '../../components/autocomplete-2/autocomplete-2';
import {
  apiProviderIdentifiersToClientIdentifers,
  apiVpnSitesToClientVpnSite,
} from '../../components/forms/converters';
import SiteNetworkAccessForm from '../../components/forms/site-network-access-form';
import { AccessPriority, RequestedCVlan, SiteNetworkAccess, VpnSite } from '../../components/forms/site-types';
import { generateNetworkAccessId } from '../../helpers/id-helpers';
import callbackUtils from '../../callback-utils';

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
  bearer: {
    alwaysOn: false,
    bearerReference: '',
    requestedCLan: RequestedCVlan.l3vpn,
    requestedType: {
      requestedType: 'dotlat',
      strict: false,
    },
  },
  service: {
    svcInputBandwidth: 1000,
    svcOutputBandwidth: 1000,
    qosProfiles: [''],
  },
});

// TODO: to be defined
const getBandwidths = async () => {
  return [1000, 2000, 5000, 10000];
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateSiteNetAccessPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
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

  const handleSiteItemChange = (item?: Item | null) => {
    // eslint-disable-next-line no-console
    console.log('site changed');
    const site = vpnSites?.filter((s) => s.siteId === item?.value).pop();
    setSelectedSite(site || null);
  };

  const vpnItems = vpnSites
    ? vpnSites.map((s) => ({
        value: unwrap(s.siteId),
        label: unwrap(s.siteId),
      }))
    : [];

  const [selectedVpnItem] = vpnItems.filter((item) => item.value === selectedSite?.siteId);

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create Site Network Access</Heading>
        {vpnSites && (
          <>
            <FormControl id="selected-site" my={6}>
              <FormLabel>Select site:</FormLabel>
              <Autocomplete2 items={vpnItems} selectedItem={selectedVpnItem} onChange={handleSiteItemChange} />
            </FormControl>
            {selectedSite && (
              <>
                {/* <SiteInfo site={selectedSite} /> */}
                <SiteNetworkAccessForm
                  mode="add"
                  qosProfiles={qosProfiles}
                  bfdProfiles={bfdProfiles}
                  bandwidths={bandwiths}
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
