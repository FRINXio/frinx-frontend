import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
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

export async function getSiteNetworkChanges(
  data: CalcDiffPayload,
  siteId: string,
): Promise<SiteNetworkAccessWithStatus[]> {
  const { changes } = data;
  const createdSiteNetworkChanges = changes.creates.sites;
  const createdNetworksPromise = getNetworkList(createdSiteNetworkChanges, siteId);

  const updatesSiteNetworkChanges = changes.updates.sites;
  const updatedNetworksPromise = getNetworkList(updatesSiteNetworkChanges, siteId);

  const [createdNetworkList, updatedNetworkList] = await Promise.all([createdNetworksPromise, updatedNetworksPromise]);
  const createdNetworkListWithStatus = createdNetworkList.map((n) => ({ ...n, status: StatusEnum.CREATED }));
  const updatedNetworkListWithStatus = updatedNetworkList.map((n) => ({ ...n, status: StatusEnum.UPDATED }));
  return [...createdNetworkListWithStatus, ...updatedNetworkListWithStatus];
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
