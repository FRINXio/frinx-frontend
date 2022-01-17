import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import {
  apiVpnSitesToClientVpnSite,
  apiProviderIdentifiersToClientIdentifers,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import VpnSiteForm from '../../components/forms/vpn-site-form';
import ErrorMessage from '../../components/error-message/error-message';
import callbackUtils from '../../unistore-callback-utils';
import unwrap from '../../helpers/unwrap';

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

const EditVpnSitePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const { siteId } = useParams<{ siteId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const sites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setVpnSites(clientVpnSites);

      const profiles = await callbacks.getValidProviderIdentifiers();
      const clientProfiles = apiProviderIdentifiersToClientIdentifers(profiles);
      setQosProfiles(clientProfiles.qosIdentifiers);
    };

    fetchData();
  }, []);

  const handleSubmit = async (site: VpnSite) => {
    setSubmitError(null);
    // eslint-disable-next-line no-console
    console.log('submit clicked', site);
    const callbacks = callbackUtils.getCallbacks;
    try {
      const apiSite = clientVpnSiteToApiVpnSite(site);
      await callbacks.editVpnSite(apiSite);
      onSuccess();
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  // TODO: add some loading state
  if (!vpnSites) {
    return null;
  }

  const selectedSite = getSelectedSite(vpnSites, siteId);

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Edit VPN Site</Heading>
        </Flex>
        <Heading size="sm" paddingTop={2}>
          Site Id: {siteId}
        </Heading>
        {submitError && <ErrorMessage text={String(submitError)} />}
        {vpnSites && selectedSite && (
          <VpnSiteForm
            mode="edit"
            sites={vpnSites}
            site={selectedSite}
            qosProfiles={qosProfiles}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Box>
    </Container>
  );
};

export default EditVpnSitePage;
