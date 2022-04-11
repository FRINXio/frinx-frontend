import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { SiteNetworkAccess } from '../../components/forms/site-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type SiteNetworkAccessWithStatus = SiteNetworkAccess & { status: Status };

type DeletedNetworkAccess = {
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

export async function getSiteNetworkChanges(
  data: CalcDiffPayload,
  siteId: string,
  networkAccessId: string,
): Promise<SiteNetworkAccessWithStatus[]> {
  const { changes } = data;

  // we get all site ids that were updated
  const updateSiteIds = getIdList(changes.updates.sites);
  // const deletedIds = (changes.deletes.vpn_service as DeletedNetworkAccess[])
  //   .map((site) => getIdList(site['path-keys']));
  //   .flat();

  // // we get all config data for every site changed
  // const callbacks = unistoreCallbackUtils.getCallbacks;
  // const createdPromises = createdIds.map((serviceId) => callbacks.getVpnService(serviceId));
  // const updatedPromises = updatedIds.map((serviceId) => callbacks.getVpnService(serviceId));
  // const deletedPromises = deletedIds.map((serviceId) => callbacks.getVpnService(serviceId));
  // const createdServices = await Promise.all(createdPromises);
  // const updatedServices = await Promise.all(updatedPromises);
  // const deletedServices = await Promise.all(deletedPromises);

  // // we inject status (created/updated/deleted) to every site, that was changed
  // const createdServicesWithStatus: VpnServiceWithStatus[] = createdServices
  //   .map((services) => apiVpnServiceToClientVpnService(services).map((s) => ({ ...s, status: 'CREATED' as Status })))
  //   .flat();
  // const updatedServicesWithStatus: VpnServiceWithStatus[] = updatedServices
  //   .map((services) => apiVpnServiceToClientVpnService(services).map((s) => ({ ...s, status: 'UPDATED' as Status })))
  //   .flat();
  // const deletedServicesWithStatus: VpnServiceWithStatus[] = deletedServices
  //   .map((services) => apiVpnServiceToClientVpnService(services).map((s) => ({ ...s, status: 'DELETED' as Status })))
  //   .flat();

  // return [...createdServicesWithStatus, ...updatedServicesWithStatus, ...deletedServicesWithStatus];
  return [];
}

export function getSavedNetworkAccessesWithStatus(
  NetworkAccesses: SiteNetworkAccess[] | null,
  updatedNetworkAccesses: SiteNetworkAccess[] | null,
  deletedNetworkAccesses: SiteNetworkAccess[] | null,
): SiteNetworkAccessWithStatus[] {
  return (
    NetworkAccesses?.map((site) => {
      const updatedSite =
        updatedNetworkAccesses?.filter((i) => i.siteNetworkAccessId === site.siteNetworkAccessId) || [];
      if (updatedSite.length) {
        return {
          ...updatedSite[0],
          status: 'UPDATED',
        };
      }

      const deletedSite =
        deletedNetworkAccesses?.filter((i) => i.siteNetworkAccessId === site.siteNetworkAccessId) || [];
      if (deletedSite.length) {
        return {
          ...deletedSite[0],
          status: 'DELETED',
        };
      }

      return {
        ...site,
        status: 'NO_CHANGE',
      };
    }) || []
  );
}
