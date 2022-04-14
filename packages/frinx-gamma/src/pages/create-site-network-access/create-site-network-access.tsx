import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import unwrap from '../../helpers/unwrap';
import {
  apiProviderIdentifiersToClientIdentifers,
  apiVpnSitesToClientVpnSite,
  apiVpnServiceToClientVpnService,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import SiteNetworkAccessForm from '../../components/forms/site-network-access-form';
import ErrorMessage from '../../components/error-message/error-message';
import { AccessPriority, SiteNetworkAccess, VpnSite } from '../../components/forms/site-types';
import { generateNetworkAccessId } from '../../helpers/id-helpers';
import callbackUtils from '../../unistore-callback-utils';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { VpnService } from '../../components/forms/service-types';
import { getSelectOptions } from '../../components/forms/options.helper';
import { DefaultCVlanEnum } from '../../network-types';
import useCalcDiffContext from '../../providers/calcdiff-provider/use-calcdiff-context';

const getDefaultNetworkAccess = (selectedSite: VpnSite | null): SiteNetworkAccess => ({
  siteNetworkAccessId: generateNetworkAccessId(),
  siteNetworkAccessType: 'point-to-point',
  maximumRoutes: selectedSite?.maximumRoutes || 1000,
  accessPriority: AccessPriority['Primary Ethernet'],
  locationReference: null,
  deviceReference: null,
  routingProtocols: [
    {
      type: 'static',
      vrrp: 'ipv4',
      bgp: {
        addressFamily: 'ipv4',
        autonomousSystem: '',
        bgpProfile: null,
      },
      static: [
        // {
        //   lanTag: '',
        //   lan: '10.0.0.1/0',
        //   nextHop: '10.0.0.3',
        // },
      ],
    },
  ],
  bearer: {
    alwaysOn: false,
    bearerReference: '',
    defaultCVlan: DefaultCVlanEnum['Main Corporate VPN'],
    requestedType: {
      requestedType: 'dot1ad',
      strict: false,
    },
  },
  service: {
    svcInputBandwidth: 1000,
    svcOutputBandwidth: 1000,
    qosProfiles: [selectedSite?.siteServiceQosProfile || ''],
  },
  vpnAttachment: null,
  siteRole: 'any-to-any-role',
  ipConnection: {
    ipv4: {
      addressAllocationType: 'static-address',
      addresses: {},
    },
  },
});

// TODO: to be defined
const getBandwidths = async () =>
  getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site_network_access.bandwidths).map((item) => Number(item.key));

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

function freeResources(siteNetworkAcessId: string) {
  const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
  uniflowCallbacks.executeWorkflow({
    name: 'Cleanup_ipv4_pool',
    version: 1,
    input: {
      pool_tag: siteNetworkAcessId, // eslint-disable-line @typescript-eslint/naming-convention
    },
  });
}

const CreateSiteNetAccessPage: VoidFunctionComponent = () => {
  const { invalidateCache } = useCalcDiffContext();
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const [bgpProfiles, setBgpProfiles] = useState<string[]>([]);
  const [vpnServices, setVpnServices] = useState<VpnService[]>([]);
  const [bandwiths, setBandwiths] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // TODO: we can fetch all in promise all?
      const callbacks = callbackUtils.getCallbacks;
      const sites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);

      const profiles = await callbacks.getValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);

      const bandwithsResponse = await getBandwidths();

      const services = await callbacks.getVpnServices(null, null);
      const clientVpnServices = apiVpnServiceToClientVpnService(services);

      setVpnSites(clientVpnSites);
      setVpnServices(clientVpnServices);
      setBfdProfiles(clientProfiles.bfdIdentifiers);
      setQosProfiles(clientProfiles.qosIdentifiers);
      setBgpProfiles(clientProfiles.bgpIdentifiers);
      setBandwiths(bandwithsResponse);
      setSelectedSite(getSelectedSite(clientVpnSites, unwrap(siteId)));
    };

    fetchData();
  }, [siteId]);

  const handleSubmit = async (s: VpnSite) => {
    setSubmitError(null);
    // eslint-disable-next-line no-console
    console.log('submit clicked', s);
    const callbacks = callbackUtils.getCallbacks;

    try {
      const apiSite = clientVpnSiteToApiVpnSite(s);
      await callbacks.editVpnSite(apiSite);
      // eslint-disable-next-line no-console
      console.log('site saved: network access added to site');
      invalidateCache();
      navigate(`../sites/detail/${s.siteId}`);
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = (siteNetworkAccessId: string) => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    freeResources(siteNetworkAccessId);
    navigate(`../sites/detail/${selectedSite?.siteId}`);
  };

  const handleReset = (siteNetworkAccessId: string) => {
    freeResources(siteNetworkAccessId);
  };

  const networkAccess: SiteNetworkAccess = getDefaultNetworkAccess(selectedSite);

  return (
    <Container maxWidth={1280}>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create Site Network Access</Heading>
        {vpnSites && selectedSite && (
          <>
            {/* <SiteInfo site={selectedSite} /> */}
            {submitError && <ErrorMessage text={String(submitError)} />}
            <SiteNetworkAccessForm
              mode="add"
              qosProfiles={qosProfiles}
              bfdProfiles={bfdProfiles}
              bgpProfiles={bgpProfiles}
              vpnServices={vpnServices}
              bandwidths={bandwiths}
              site={selectedSite}
              selectedNetworkAccess={networkAccess}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onReset={handleReset}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default CreateSiteNetAccessPage;
