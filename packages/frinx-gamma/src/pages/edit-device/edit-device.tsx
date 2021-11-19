import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import callbackUtils from '../../callback-utils';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import DeviceForm from '../../components/forms/device-form';
import { SiteDevice, VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  onSuccess: (siteId: string, locationId: string) => void;
  onCancel: (siteId: string, locationId: string) => void;
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
  const { siteId, locationId, deviceId } = useParams<{ siteId: string; locationId: string; deviceId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites(null, null);
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
    const callbacks = callbackUtils.getCallbacks;

    await callbacks.editVpnSite(editedSite);
    onSuccess(unwrap(siteId), locationId);
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedSite?.siteId), locationId);
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
            mode="edit"
            siteId={unwrap(selectedSite.siteId)}
            device={selectedDevice}
            locationId={locationId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Container>
    )
  );
};

export default EditDevicePage;
