import { CustomerLocation } from '../../network-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type CustomerLocationWithStatus = CustomerLocation & { status: Status };

export function getChangedLocationsWithStatus(
  createdLocations: CustomerLocation[] | null,
  updatedLocations: CustomerLocation[] | null,
  deletedLocations: CustomerLocation[] | null,
): CustomerLocationWithStatus[] {
  const createdDevicesWithStatus: CustomerLocationWithStatus[] =
    createdLocations?.map((location) => {
      return {
        ...location,
        status: 'CREATED',
      };
    }) || [];

  const updatedDevicesWithStatus: CustomerLocationWithStatus[] =
    updatedLocations?.map((location) => {
      return {
        ...location,
        status: 'UPDATED',
      };
    }) || [];

  const deletedDevicesWithStatus: CustomerLocationWithStatus[] =
    deletedLocations?.map((location) => {
      return {
        ...location,
        status: 'DELETED',
      };
    }) || [];

  return [...createdDevicesWithStatus, ...updatedDevicesWithStatus, ...deletedDevicesWithStatus];
}

export function getSavedLocationsWithStatus(
  locations: CustomerLocation[] | null,
  updatedLocations: CustomerLocation[] | null,
  deletedLocations: CustomerLocation[] | null,
): CustomerLocationWithStatus[] {
  return (
    locations?.map((location) => {
      const updatedSite = updatedLocations?.filter((i) => i.locationId === location.locationId) || [];
      if (updatedSite.length) {
        return {
          ...updatedSite[0],
          status: 'UPDATED',
        };
      }

      const deletedSite = deletedLocations?.filter((i) => i.locationId === location.locationId) || [];
      if (deletedSite.length) {
        return {
          ...deletedSite[0],
          status: 'DELETED',
        };
      }

      return {
        ...location,
        status: 'NO_CHANGE',
      };
    }) || []
  );
}
