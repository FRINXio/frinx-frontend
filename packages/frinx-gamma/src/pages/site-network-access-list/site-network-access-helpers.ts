import {
  CalcDiffPayload,
  DeletedNetworkAccess,
} from '../../components/commit-status-modal/commit-status-modal.helpers';
import { SiteNetworkAccess } from '../../components/forms/site-types';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import { apiSiteNetworkAccessToClientSiteNetworkAccess } from '../../components/forms/converters';
import { StatusEnum } from '../service-list/service-helpers';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type SiteNetworkAccessWithStatus = SiteNetworkAccess & { status: Status };

function isSiteNetworkChange(value: unknown): value is {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'site-network-accesses': Record<string, unknown>;
} {
  if (value == null) {
    return false;
  }
  return typeof value === 'object' && 'site-network-accesses' in value;
}

type SiteChanges = Record<string, unknown>;
type SiteNetworkChanges = Record<string, unknown>;

function getSiteNetworkAccesses(changes: SiteChanges, siteId: string): SiteNetworkChanges {
  // // we get site changes
  const siteChanges: unknown | undefined = changes[siteId];

  // we get sna changes
  if (isSiteNetworkChange(siteChanges)) {
    const { 'site-network-accesses': siteNetworkAccesses } = siteChanges;
    return siteNetworkAccesses;
  }
  return {};
}

async function getNetworkList(changes: SiteChanges, siteId: string): Promise<SiteNetworkAccess[]> {
  const siteNetworkAccessChanges = getSiteNetworkAccesses(changes, siteId);
  const networkEntries = Object.entries(siteNetworkAccessChanges);

  const networkList = networkEntries.map((entry) => {
    const typedEntry = entry;
    return typedEntry[0];
  });

  const unistoreCallbacks = unistoreCallbackUtils.getCallbacks;

  const networkPromises = networkList.map((siteNetworkAccessId) =>
    unistoreCallbacks.getSiteNetworkAccess(siteId, siteNetworkAccessId),
  );

  const apiNetworks = await Promise.all(networkPromises);
  const clientNetworks = apiNetworks.map((n) => apiSiteNetworkAccessToClientSiteNetworkAccess(n)).flat();
  return clientNetworks;
}

function getDeletedIds(deletedNetworkAccesses: DeletedNetworkAccess[], siteId: string): string[] {
  return deletedNetworkAccesses
    .filter((dna) => dna['path-keys'].vpnSite === siteId)
    .map((dna) => {
      const deletedIds = dna['path-keys'].siteNetworkAccess;
      return deletedIds;
    });
}

async function getDeletedNetworkData(networkIds: string[], siteId: string): Promise<SiteNetworkAccess[]> {
  const unistoreCallbacks = unistoreCallbackUtils.getCallbacks;

  const networkPromises = networkIds.map((siteNetworkAccessId) =>
    unistoreCallbacks.getSiteNetworkAccess(siteId, siteNetworkAccessId, 'nonconfig'),
  );

  const deletedNetworkList = await Promise.all(networkPromises);
  const clientDeletedNetworkList = deletedNetworkList
    .map((n) => apiSiteNetworkAccessToClientSiteNetworkAccess(n))
    .flat();
  return clientDeletedNetworkList;
}

export async function getSiteNetworkChanges(
  data: CalcDiffPayload,
  siteId: string,
): Promise<SiteNetworkAccessWithStatus[]> {
  const { changes } = data;
  const createdSiteNetworkChanges = changes.creates.sites;
  const createdNetworksPromise = getNetworkList(createdSiteNetworkChanges, siteId);

  const updatedSiteNetworkChanges = changes.updates.sites;
  const updatedNetworksPromise = getNetworkList(updatedSiteNetworkChanges, siteId);

  const deletedIds = getDeletedIds(changes.deletes.site_network_access, siteId);
  const deletedNetworkPromise = getDeletedNetworkData(deletedIds, siteId);

  const [createdNetworkList, updatedNetworkList, deletedNetworkList] = await Promise.all([
    createdNetworksPromise,
    updatedNetworksPromise,
    deletedNetworkPromise,
  ]);
  const createdNetworkListWithStatus = createdNetworkList.map((n) => ({ ...n, status: StatusEnum.CREATED }));
  const updatedNetworkListWithStatus = updatedNetworkList.map((n) => ({ ...n, status: StatusEnum.UPDATED }));
  const deletedNetworkListWithStatus = deletedNetworkList.map((n) => ({ ...n, status: StatusEnum.DELETED }));

  return [...createdNetworkListWithStatus, ...updatedNetworkListWithStatus, ...deletedNetworkListWithStatus];
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
          status: StatusEnum.UPDATED,
        };
      }

      const deletedSite =
        deletedNetworkAccesses?.filter((i) => i.siteNetworkAccessId === site.siteNetworkAccessId) || [];
      if (deletedSite.length) {
        return {
          ...deletedSite[0],
          status: StatusEnum.DELETED,
        };
      }

      return {
        ...site,
        status: StatusEnum.NO_CHANGE,
      };
    }) || []
  );
}
