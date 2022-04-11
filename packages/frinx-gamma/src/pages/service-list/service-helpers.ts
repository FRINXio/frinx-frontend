import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import { VpnService } from '../../components/forms/service-types';
import unistoreCallbackUtils from '../../unistore-callback-utils';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type VpnServiceWithStatus = VpnService & { status: Status };

type DeletedService = {
  path: string;
  [`path-keys`]: Record<'string', unknown>;
  data: unknown;
};

function getIdList(record: Record<string, unknown>): string[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.keys(record).filter((k) => {
    return true;
  });
}

export async function getServiceChanges(data: CalcDiffPayload): Promise<VpnServiceWithStatus[]> {
  const { changes } = data;

  // we get all site ids that were changed
  const createdIds = getIdList(changes.creates['vpn-services']);
  const updatedIds = getIdList(changes.updates['vpn-services']);
  const deletedIds = (changes.deletes.vpn_service as DeletedService[])
    .map((site) => getIdList(site['path-keys']))
    .flat();

  // we get all config data for every site changed
  const callbacks = unistoreCallbackUtils.getCallbacks;
  const createdPromises = createdIds.map((serviceId) => callbacks.getVpnService(serviceId));
  const updatedPromises = updatedIds.map((serviceId) => callbacks.getVpnService(serviceId));
  const deletedPromises = deletedIds.map((serviceId) => callbacks.getVpnService(serviceId));
  const createdServices = await Promise.all(createdPromises);
  const updatedServices = await Promise.all(updatedPromises);
  const deletedServices = await Promise.all(deletedPromises);

  // we inject status (created/updated/deleted) to every site, that was changed
  const createdServicesWithStatus: VpnServiceWithStatus[] = createdServices
    .map((services) => apiVpnServiceToClientVpnService(services).map((s) => ({ ...s, status: 'CREATED' as Status })))
    .flat();
  const updatedServicesWithStatus: VpnServiceWithStatus[] = updatedServices
    .map((services) => apiVpnServiceToClientVpnService(services).map((s) => ({ ...s, status: 'UPDATED' as Status })))
    .flat();
  const deletedServicesWithStatus: VpnServiceWithStatus[] = deletedServices
    .map((services) => apiVpnServiceToClientVpnService(services).map((s) => ({ ...s, status: 'DELETED' as Status })))
    .flat();

  return [...createdServicesWithStatus, ...updatedServicesWithStatus, ...deletedServicesWithStatus];
}

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
