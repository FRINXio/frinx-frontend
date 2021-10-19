import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router';
import unwrap from '../../helpers/unwrap';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import DeviceForm from '../../components/forms/device-form';
import { SiteDevice, VpnSite } from '../../components/forms/site-types';
import callbackUtils from '../../callback-utils';

type Props = {
  onSuccess: (siteId: string) => void;
  onCancel: (siteId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

function getSelectedDevice(site: VpnSite, deviceId: string): SiteDevice {
  const [device] = site.siteDevices.filter((a) => unwrap(a.deviceId) === deviceId);
  return device;
}

const EditDevicePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const { siteId, deviceId } = useParams<{ siteId: string; deviceId: string }>();

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

    const oldDevices = [...selectedSite.siteDevices];
    const newDevices = oldDevices.map((oldDevice) => {
      return oldDevice.deviceId === device.deviceId ? device : oldDevice;
    });
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

  if (!selectedSite) {
    return null;
  }

  const selectedDevice = getSelectedDevice(selectedSite, deviceId);

  return (
    selectedSite && (
      <Container>
        <Box padding={6} margin={6} background="white">
          <Heading size="md">Edit Device: {deviceId} </Heading>
          <DeviceForm
            siteId={unwrap(selectedSite.siteId)}
            device={selectedDevice}
            locations={selectedSite.customerLocations}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Container>
    )
  );
};

export default EditDevicePage;
