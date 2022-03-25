import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import unwrap from '../../helpers/unwrap';
import {
  apiSiteDevicesToClientSiteDevices,
  apiVpnSitesToClientVpnSite,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import DeviceForm from '../../components/forms/device-form';
import ErrorMessage from '../../components/error-message/error-message';
import { SiteDevice, VpnSite } from '../../components/forms/site-types';
import callbackUtils from '../../unistore-callback-utils';

const getDefaultDevice = (locationId: string): SiteDevice => ({
  deviceId: '',
  managementIP: '',
  locationId,
});

type Props = {
  onSuccess: (siteId: string, locationId: string) => void;
  onCancel: (siteId: string, locationId: string) => void;
};

function getSelectedSite(sites: VpnSite[], siteId: string): VpnSite {
  const [vpnService] = sites.filter((s) => unwrap(s.siteId) === siteId);
  return vpnService;
}

function nonEmptyDevices<T>(name: T | undefined): name is T {
  return name !== undefined;
}

const CreateDevicePage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  const [deviceNames, setDeviceNames] = useState<string[]>([]);
  const [selectedSite, setSelectedSite] = useState<VpnSite | null>(null);
  const { siteId, locationId } = useParams<{ siteId: string; locationId: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      // TODO: we can fetch all in promise all?
      const sites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(sites);
      setSelectedSite(getSelectedSite(clientVpnSites, siteId));
      const devices = await callbacks.getDevices(siteId, null, null);
      const clientDevices = apiSiteDevicesToClientSiteDevices(devices);
      setDeviceNames(clientDevices.map((d) => d.deviceId).filter(nonEmptyDevices));
    };

    fetchData();
  }, [siteId]);

  const handleSubmit = async (device: SiteDevice) => {
    setSubmitError(null);
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

    try {
      const apiSite = clientVpnSiteToApiVpnSite(editedSite);
      await callbacks.editVpnSite(apiSite);
      // eslint-disable-next-line no-console
      console.log('site saved: network access added to site');
      onSuccess(unwrap(siteId), locationId);
    } catch (e) {
      setSubmitError(String(e));
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel(unwrap(selectedSite?.siteId), locationId);
  };

  if (!selectedSite) {
    return null;
  }

  return (
    selectedSite && (
      <Container>
        <Box padding={6} margin={6} background="white">
          <Box>
            <Heading size="md" marginBottom={2}>
              Add Device
            </Heading>
            <Heading size="sm">To Site: {siteId}</Heading>
          </Box>
          {submitError && <ErrorMessage text={String(submitError)} />}
          <DeviceForm
            mode="add"
            device={getDefaultDevice(locationId)}
            locations={selectedSite.customerLocations}
            existingDeviceNames={deviceNames}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Container>
    )
  );
};

export default CreateDevicePage;
