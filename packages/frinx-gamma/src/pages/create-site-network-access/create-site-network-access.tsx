import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import unwrap from '../../helpers/unwrap';
import {
  apiProviderIdentifiersToClientIdentifers,
  apiVpnSitesToClientVpnSite,
  apiVpnServiceToClientVpnService,
} from '../../components/forms/converters';
import SiteNetworkAccessForm from '../../components/forms/site-network-access-form';
import ErrorMessage from '../../components/error-message/error-message';
import { AccessPriority, SiteNetworkAccess, VpnSite } from '../../components/forms/site-types';
import { generateNetworkAccessId } from '../../helpers/id-helpers';
import callbackUtils from '../../unistore-callback-utils';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { VpnService } from '../../components/forms/service-types';
import { getSelectOptions } from '../../components/forms/options.helper';
import PollWorkflowId from '../../components/poll-workflow-id/poll-worfklow-id';

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
        autonomousSystem: '',
        bgpProfile: null,
      },
      static: [
        {
          lanTag: '',
          lan: '10.0.0.1/0',
          nextHop: '10.0.0.3',
        },
      ],
    },
  ],
  bearer: {
    alwaysOn: false,
    bearerReference: '',
    requestedCLan: '400', // l3vpn
    requestedType: {
      requestedType: 'dot1ad',
      strict: false,
    },
  },
  service: {
    svcInputBandwidth: 1000,
    svcOutputBandwidth: 1000,
    qosProfiles: [''],
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

type CustomerAddressWorkflowData = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  response_body: {
    address: string;
  };
};

// TODO: to be defined
const getBandwidths = async () =>
  getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site_network_access.bandwidths).map((item) => Number(item.key));

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

const CreateSiteNetAccessPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [customerAddress, setCustomerAddress] = useState<string | null>(null);
  const [vpnSites, setVpnSites] = useState<VpnSite[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const [bfdProfiles, setBfdProfiles] = useState<string[]>([]);
  const [qosProfiles, setQosProfiles] = useState<string[]>([]);
  const [bgpProfiles, setBgpProfiles] = useState<string[]>([]);
  const [vpnServices, setVpnServices] = useState<VpnService[]>([]);
  const [bandwiths, setBandwiths] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { siteId } = useParams<{ siteId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      // TODO: we can fetch all in promise all?
      const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
      const workflowResult = await uniflowCallbacks.executeWorkflow({
        name: 'Allocate_CustomerAddress',
        version: 1,
        input: {},
      });
      setWorkflowId(workflowResult.text);
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
      setSelectedSite(getSelectedSite(clientVpnSites, siteId));
    };

    fetchData();
  }, [siteId]);

  const handleSubmit = async (s: VpnSite) => {
    setSubmitError(null);
    // eslint-disable-next-line no-console
    console.log('submit clicked', s);
    const callbacks = callbackUtils.getCallbacks;

    try {
      await callbacks.editVpnSite(s);
      // eslint-disable-next-line no-console
      console.log('site saved: network access added to site');
      onSuccess(unwrap(s.siteId));
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = async () => {
    const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
    await uniflowCallbacks.executeWorkflow({
      name: 'Free_CustomerAddress',
      version: 1,
      input: {},
    });
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedSite?.siteId));
  };

  const handleWorkflowFinish = (data: string | null) => {
    if (data === null) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { response_body }: CustomerAddressWorkflowData = JSON.parse(data);
    setCustomerAddress(response_body.address);
  };

  if (!workflowId) {
    return null;
  }

  if (!customerAddress) {
    return <PollWorkflowId workflowId={workflowId} onFinish={handleWorkflowFinish} />;
  }

  const networkAccess: SiteNetworkAccess = getDefaultNetworkAccess();
  networkAccess.ipConnection = {
    ...networkAccess.ipConnection,
    ipv4: {
      ...networkAccess.ipConnection?.ipv4,
      addresses: {
        ...networkAccess.ipConnection?.ipv4?.addresses,
        customerAddress,
      },
    },
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
                {submitError && <ErrorMessage text={String(submitError)} />}
                <SiteNetworkAccessForm
                  mode="add"
                  qosProfiles={qosProfiles}
                  bfdProfiles={bfdProfiles}
                  bgpProfiles={bgpProfiles}
                  vpnIds={vpnServices?.map((s) => unwrap(s.vpnId))}
                  bandwidths={bandwiths}
                  sites={vpnSites}
                  site={selectedSite}
                  selectedNetworkAccess={networkAccess}
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
