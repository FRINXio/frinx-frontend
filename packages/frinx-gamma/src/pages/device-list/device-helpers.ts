import { SiteDevice } from '../../components/forms/site-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type SiteDeviceWithStatus = SiteDevice & { status: Status };

export function getChangedDevicesWithStatus(
  createdDevices: SiteDevice[] | null,
  updatedDevices: SiteDevice[] | null,
  deletedDevices: SiteDevice[] | null,
): SiteDeviceWithStatus[] {
  const createdDevicesWithStatus: SiteDeviceWithStatus[] =
    createdDevices?.map((device) => {
      return {
        ...device,
        status: 'CREATED',
      };
    }) || [];

  const updatedDevicesWithStatus: SiteDeviceWithStatus[] =
    updatedDevices?.map((device) => {
      return {
        ...device,
        status: 'UPDATED',
      };
    }) || [];

  const deletedDevicesWithStatus: SiteDeviceWithStatus[] =
    deletedDevices?.map((device) => {
      return {
        ...device,
        status: 'DELETED',
      };
    }) || [];

  return [...createdDevicesWithStatus, ...updatedDevicesWithStatus, ...deletedDevicesWithStatus];
}

export function getSavedDevicesWithStatus(
  devices: SiteDevice[] | null,
  updatedDevices: SiteDevice[] | null,
  deletedDevices: SiteDevice[] | null,
): SiteDeviceWithStatus[] {
  return (
    devices?.map((device) => {
      const updatedSite = updatedDevices?.filter((i) => i.deviceId === device.deviceId) || [];
      if (updatedSite.length) {
        return {
          ...updatedSite[0],
          status: 'UPDATED',
        };
      }

      const deletedSite = deletedDevices?.filter((i) => i.deviceId === device.deviceId) || [];
      if (deletedSite.length) {
        return {
          ...deletedSite[0],
          status: 'DELETED',
        };
      }

      return {
        ...device,
        status: 'NO_CHANGE',
      };
    }) || []
  );
}
