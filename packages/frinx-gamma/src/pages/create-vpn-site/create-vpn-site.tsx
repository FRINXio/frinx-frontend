import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../unistore-callback-utils';
import {
  apiVpnSitesToClientVpnSite,
  apiProviderIdentifiersToClientIdentifers,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import VpnSiteForm from '../../components/forms/vpn-site-form';
import ErrorMessage from '../../components/error-message/error-message';
import { generateSiteId } from '../../helpers/id-helpers';

const defaultVpnSite: VpnSite = {
  customerLocations: [],
  siteDevices: [],
  siteManagementType: 'provider-managed',
  siteVpnFlavor: 'site-vpn-flavor-single',
  siteServiceQosProfile: '',
  enableBgpPicFastReroute: false,
  siteNetworkAccesses: [],
  maximumRoutes: 1000,
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateVpnSitePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
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
    // eslint-disable-next-line no-param-reassign
    const siteWithId = {
      ...site,
      siteId: generateSiteId(),
    };
    const callbacks = callbackUtils.getCallbacks;
    try {
      const apiSite = clientVpnSiteToApiVpnSite(siteWithId);
      await callbacks.createVpnSite(apiSite);
      // eslint-disable-next-line no-console
      console.log('site created');
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

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Site</Heading>
        {submitError && <ErrorMessage text={String(submitError)} />}
        {vpnSites && (
          <VpnSiteForm
            mode="add"
            sites={[]}
            site={defaultVpnSite}
            qosProfiles={qosProfiles}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Box>
    </Container>
  );
};

export default CreateVpnSitePage;
