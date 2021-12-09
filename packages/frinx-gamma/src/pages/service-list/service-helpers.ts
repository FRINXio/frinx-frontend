import { VpnService } from '../../components/forms/service-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type VpnServiceWithStatus = VpnService & { status: Status };

export function getChangedServicesWithStatus(
  createdServices: VpnService[] | null,
  updatedServices: VpnService[] | null,
  deletedServices: VpnService[] | null,
): VpnServiceWithStatus[] {
  const createdServicesWithStatus: VpnServiceWithStatus[] =
    createdServices?.map((service) => {
      return {
        ...service,
        status: 'CREATED',
      };
    }) || [];

  const updatedServicesWithStatus: VpnServiceWithStatus[] =
    updatedServices?.map((service) => {
      return {
        ...service,
        status: 'UPDATED',
      };
    }) || [];

  const deletedServicesWithStatus: VpnServiceWithStatus[] =
    deletedServices?.map((service) => {
      return {
        ...service,
        status: 'DELETED',
      };
    }) || [];

  return [...createdServicesWithStatus, ...updatedServicesWithStatus, ...deletedServicesWithStatus];
}

export function getSavedServicesWithStatus(
  services: VpnService[] | null,
  updatedServices: VpnService[] | null,
  deletedServices: VpnService[] | null,
): VpnServiceWithStatus[] {
  return (
    services?.map((service) => {
      const updatedService = updatedServices?.filter((i) => i.vpnId === service.vpnId) || [];
      if (updatedService.length) {
        return {
          ...updatedService[0],
          status: 'UPDATED',
        };
      }

      const deletedService = deletedServices?.filter((i) => i.vpnId === service.vpnId) || [];
      if (deletedService.length) {
        return {
          ...deletedService[0],
          status: 'DELETED',
        };
      }

      return {
        ...service,
        status: 'NO_CHANGE',
      };
    }) || []
  );
}
