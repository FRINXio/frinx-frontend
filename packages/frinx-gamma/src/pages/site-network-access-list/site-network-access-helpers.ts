import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { SiteNetworkAccess } from '../../components/forms/site-types';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import { apiSiteNetworkAccessToClientSiteNetworkAccess } from '../../components/forms/converters';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type SiteNetworkAccessWithStatus = SiteNetworkAccess & { status: Status };

function isSiteNetworkChange(value: object): boolean {
  return 'site-network-accesses' in value;
}

type SiteChanges = Record<string, unknown>;
type SiteNetworkChanges = Record<string, unknown>;

function getSiteNetworkAccesses(changes: SiteChanges, siteId: string): SiteNetworkChanges {
  // // we get site changes
  const siteChanges: unknown | undefined = changes[siteId];
  if (!siteChanges || !isSiteNetworkChange(siteChanges as object)) {
    return {};
  }

  // we get sna changes
  const { 'site-network-accesses': siteNetworkAccesses } = siteChanges as {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'site-network-accesses': Record<string, unknown>;
  };

  return siteNetworkAccesses;
}

async function getNetworkList(changes: SiteChanges, siteId: string): Promise<SiteNetworkAccess[]> {
  const siteNetworkAccessChanges = getSiteNetworkAccesses(changes, siteId);
  const networkEntries = Object.entries(siteNetworkAccessChanges);

  const networkList = networkEntries.map((entry) => {
    const typedEntry = entry as [string, unknown];
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
  const createdNetworkListWithStatus = createdNetworkList.map((n) => ({ ...n, status: 'CREATED' as Status }));
  const updatedNetworkListWithStatus = updatedNetworkList.map((n) => ({ ...n, status: 'UPDATED' as Status }));
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
