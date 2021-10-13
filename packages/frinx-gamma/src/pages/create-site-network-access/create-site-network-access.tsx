import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import unwrap from '../../helpers/unwrap';
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
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

const CreateSiteNetAccessPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const [bgpProfiles, setBgpProfiles] = useState<string[]>([]);
  const [bandwiths, setBandwiths] = useState<number[]>([]);
  const { siteId } = useParams<{ siteId: string }>();

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
      setBgpProfiles(clientProfiles.bgpIdentifiers);
      setBandwiths(bandwithsResponse);
      setSelectedSite(getSelectedSite(clientVpnSites, siteId));
    };

    fetchData();
  }, [siteId]);

  const handleSubmit = async (s: VpnSite) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', s);
    const callbacks = callbackUtils.getCallbacks;

    await callbacks.editVpnSite(s);
    // eslint-disable-next-line no-console
    console.log('site saved: network access added to site');
    onSuccess(unwrap(s.siteId));
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedSite?.siteId));
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create Site Network Access</Heading>
        {vpnSites && (
          <>
            {selectedSite && (
              <>
                {/* <SiteInfo site={selectedSite} /> */}
                <SiteNetworkAccessForm
                  mode="add"
                  qosProfiles={qosProfiles}
                  bfdProfiles={bfdProfiles}
                  bgpProfiles={bgpProfiles}
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
