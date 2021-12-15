import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
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

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

function getSelectedAccess(site: VpnSite, accessId: string): SiteNetworkAccess {
  const [siteNetworkAccess] = site.siteNetworkAccesses.filter((a) => unwrap(a.siteNetworkAccessId) === accessId);
  return siteNetworkAccess;
}

const EditSiteNetAccessPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const [bgpProfiles, setBgpProfiles] = useState<string[]>([]);
  const [vpnServices, setVpnServices] = useState<VpnService[]>([]);
  const [bandwiths, setBandwiths] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { siteId, accessId } = useParams<{ siteId: string; accessId: string }>();

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
      setSelectedSite(getSelectedSite(clientVpnSites, siteId));
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
      onSuccess(unwrap(s.siteId));
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedSite?.siteId));
  };

  if (!selectedSite) {
    return null;
  }

  const selectedNetworkAccess = getSelectedAccess(selectedSite, accessId);

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit Site Network Access</Heading>
        </Flex>
        {submitError && <ErrorMessage text={String(submitError)} />}
        {vpnSites && (
          <>
            {selectedSite && selectedNetworkAccess && (
              <>
                <SiteNetworkAccessForm
                  mode="edit"
                  qosProfiles={qosProfiles}
                  bfdProfiles={bfdProfiles}
                  bgpProfiles={bgpProfiles}
                  vpnIds={vpnServices.map((s) => unwrap(s.vpnId))}
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
