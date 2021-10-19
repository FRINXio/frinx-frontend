import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router';
import unwrap from '../../helpers/unwrap';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import DeviceForm from '../../components/forms/device-form';
import { SiteDevice, VpnSite } from '../../components/forms/site-types';
import callbackUtils from '../../callback-utils';

const getDefaultDevice = (): SiteDevice => ({
  deviceId: '',
  locationId: '',
  managementIP: '',
});

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

const CreateDevicePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const { siteId } = useParams<{ siteId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setSelectedSite(getSelectedSite(clientVpnSites, siteId));
    };

    fetchData();
  }, [siteId]);

  const handleSubmit = async (device: SiteDevice) => {
    if (!selectedSite) {
      return;
    }

    const newDevices = [...selectedSite.siteDevices, device];
    const editedSite: VpnSite = {
      ...selectedSite,
      siteDevices: newDevices,
    };
    // eslint-disable-next-line no-console
    console.log('submit clicked', editedSite);
    const callbacks = callbackUtils.getCallbacks;

    await callbacks.editVpnSite(editedSite);
    // eslint-disable-next-line no-console
    console.log('site saved: network access added to site');
    onSuccess(unwrap(siteId));
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedSite?.siteId));
  };

  return (
    selectedSite && (
      <Container>
        <Box padding={6} margin={6} background="white">
          <Heading size="md">Add Device To Site: {siteId} </Heading>
          <DeviceForm
            siteId={unwrap(selectedSite.siteId)}
            device={getDefaultDevice()}
            locations={selectedSite.customerLocations}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Container>
    )
  );
};

export default CreateDevicePage;
