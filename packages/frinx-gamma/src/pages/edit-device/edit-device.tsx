import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import callbackUtils from '../../unistore-callback-utils';
import { apiVpnSitesToClientVpnSite, clientVpnSiteToApiVpnSite } from '../../components/forms/converters';
import DeviceForm from '../../components/forms/device-form';
import ErrorMessage from '../../components/error-message/error-message';
import { SiteDevice, VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

function getSelectedDevice(site: VpnSite, deviceId: string): SiteDevice {
  const [device] = site.siteDevices.filter((a) => unwrap(a.deviceId) === deviceId);
  return device;
}

const EditDevicePage: VoidFunctionComponent = () => {
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const { siteId, locationId, deviceId } = useParams<{ siteId: string; locationId: string; deviceId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setSelectedSite(getSelectedSite(clientVpnSites, unwrap(siteId)));
    };

    fetchData();
  }, [siteId]);

  const handleSubmit = async (device: SiteDevice) => {
    setSubmitError(null);
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

    try {
      const apiSite = clientVpnSiteToApiVpnSite(editedSite);
      await callbacks.editVpnSite(apiSite);
      const url = locationId ? `../sites/${siteId}/${locationId}/devices` : `../sites/${siteId}/devices`;
      navigate(url);
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    const url = locationId ? `../sites/${siteId}/${locationId}/devices` : `../sites/${siteId}/devices`;
    navigate(url);
  };

  if (!selectedSite) {
    return null;
  }

  const selectedDevice = getSelectedDevice(selectedSite, unwrap(deviceId));

  return (
    selectedSite && (
      <Container>
        <Box padding={6} margin={6} background="white">
          <Heading size="md">Edit Device: {deviceId} </Heading>
          {submitError && <ErrorMessage text={String(submitError)} />}
          <DeviceForm
            mode="edit"
            locations={selectedSite.customerLocations}
            existingDeviceNames={[]}
            device={selectedDevice}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Container>
    )
  );
};

export default EditDevicePage;
