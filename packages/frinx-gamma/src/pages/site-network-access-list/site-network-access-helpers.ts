import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { SiteNetworkAccess } from '../../components/forms/site-types';
import { partition } from 'lodash';
import { string } from 'fp-ts';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import { apiSiteNetworkAccessToClientSiteNetworkAccess } from '../../components/forms/converters';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type SiteNetworkAccessWithStatus = SiteNetworkAccess & { status: Status };

// type DeletedNetworkAccess = {
//   path: string;
//   [`path-keys`]: Record<'string', unknown>;
//   data: unknown;
// };

function isSiteNetworkChange(value: object): boolean {
  return 'site-network-accesses' in value;
}

function isCreated(siteChange: Record<string, unknown>): boolean {
  return siteChange.__directly_updated === true;
}

async function getNetworkList(
  changes: Record<string, unknown>,
  siteId: string,
): Promise<SiteNetworkAccessWithStatus[]> {
  const networkEntries = Object.entries(changes);
  const [updatedEntries, createdEntries] = partition(networkEntries, isCreated);

  const updatedList = updatedEntries.map((entry) => {
    const typedEntry = entry as [string, unknown];
    return typedEntry[0];
  });

  const createdList = createdEntries.map((entry) => {
    const typedEntry = entry as [string, unknown];
    return typedEntry[0];
  });

  const unistoreCallbacks = unistoreCallbackUtils.getCallbacks;

  const updatedPromises = updatedList.map((siteNetworkAccessId) =>
    unistoreCallbacks.getSiteNetworkAccess(siteId, siteNetworkAccessId),
  );
  const createdPromises = createdList.map((siteNetworkAccessId) =>
    unistoreCallbacks.getSiteNetworkAccess(siteId, siteNetworkAccessId),
  );

  const updated = await Promise.all(updatedPromises);
  const created = await Promise.all(createdPromises);

  const clientUpdated: SiteNetworkAccessWithStatus[] = updated
    .map((sna) => apiSiteNetworkAccessToClientSiteNetworkAccess(sna))
    .flat()
    .map((sna) => ({
      ...sna,
      status: 'UPDATED' as Status,
    }));

  const clientCreated = created
    .map((sna) => apiSiteNetworkAccessToClientSiteNetworkAccess(sna))
    .flat()
    .map((sna) => ({
      ...sna,
      status: 'CREATED' as Status,
    }));

  return [...clientUpdated, ...clientCreated];
}

export async function getSiteNetworkChanges(
  data: CalcDiffPayload,
  siteId: string,
): Promise<SiteNetworkAccessWithStatus[]> {
  const { changes } = data;
  console.log('updates: ', changes.updates.sites);
  // we get site changes
  const siteChanges: unknown | undefined = changes.updates.sites[siteId];

  if (!siteChanges || !isSiteNetworkChange(siteChanges as object)) {
    return [];
  }

  console.log('sna changes: ', siteChanges);
  // we get sna changes
  const { 'site-network-accesses': siteNetworkAccesses } = siteChanges as {
    'site-network-accesses': Record<string, unknown>;
  };
  const networkList = await getNetworkList(siteNetworkAccesses, siteId);
  console.log('networkList: ', networkList);

  // const deletedIds = (changes.deletes.vpn_service as DeletedNetworkAccess[])
  //   .map((site) => getIdList(site['path-keys']));
  //   .flat();

  return networkList;
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
