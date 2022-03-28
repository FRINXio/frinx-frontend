import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import unwrap from '../../helpers/unwrap';
import {
  apiProviderIdentifiersToClientIdentifers,
  apiVpnServiceToClientVpnService,
  apiVpnSitesToClientVpnSite,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import SiteNetworkAccessForm from '../../components/forms/site-network-access-form';
import ErrorMessage from '../../components/error-message/error-message';
import { SiteNetworkAccess, VpnSite } from '../../components/forms/site-types';
import callbackUtils from '../../unistore-callback-utils';
import { VpnService } from '../../components/forms/service-types';

// TODO: to be defined
const getBandwidths = async () => {
  return [1000, 2000, 5000, 10000];
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

function getSelectedAccess(site: VpnSite, accessId: string): SiteNetworkAccess {
  const [siteNetworkAccess] = site.siteNetworkAccesses.filter((a) => unwrap(a.siteNetworkAccessId) === accessId);
  return siteNetworkAccess;
}

const EditSiteNetAccessPage: VoidFunctionComponent = () => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const [bgpProfiles, setBgpProfiles] = useState<string[]>([]);
  const [vpnServices, setVpnServices] = useState<VpnService[]>([]);
  const [bandwiths, setBandwiths] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { siteId, accessId } = useParams<{ siteId: string; accessId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);

      const profiles = await callbacks.getValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);

      const bandwithsResponse = await getBandwidths();

      const services = await callbacks.getVpnServices(null, null);
      const clientVpnServices = apiVpnServiceToClientVpnService(services);

      setVpnSites(clientVpnSites);
      setBfdProfiles(clientProfiles.bfdIdentifiers);
      setQosProfiles(clientProfiles.qosIdentifiers);
      setBgpProfiles(clientProfiles.bgpIdentifiers);
      setBandwiths(bandwithsResponse);
      setSelectedSite(getSelectedSite(clientVpnSites, unwrap(siteId)));
      setVpnServices(clientVpnServices);
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
      navigate(`../sites/detail/${siteId}`);
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    navigate(`../sites/detail/${selectedSite?.siteId}`);
  };

  if (!selectedSite) {
    return null;
  }

  const selectedNetworkAccess = getSelectedAccess(selectedSite, unwrap(accessId));

  return (
    <Container maxWidth={1280}>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit Site Network Access</Heading>
        </Flex>
        {submitError && <ErrorMessage text={String(submitError)} />}
        {vpnSites && selectedSite && selectedNetworkAccess && (
          <SiteNetworkAccessForm
            mode="edit"
            qosProfiles={qosProfiles}
            bfdProfiles={bfdProfiles}
            bgpProfiles={bgpProfiles}
            vpnServices={vpnServices}
            bandwidths={bandwiths}
            site={selectedSite}
            selectedNetworkAccess={selectedNetworkAccess}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onReset={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
          />
        )}
      </Box>
    </Container>
  );
};

export default EditSiteNetAccessPage;
