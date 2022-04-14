import { VpnSite } from '../../components/forms/site-types';
import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import unistoreCallbackUtils from '../../unistore-callback-utils';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type VpnSiteWithStatus = VpnSite & { status: Status };

type DeletedPath = {
  vpnSite: string;
};

type DeletedSite = {
  path: string;
  [`path-keys`]: DeletedPath;
  data: unknown;
};

function isSiteCreate(value: object): boolean {
  return Object.keys(value).length === 0;
}

function isSiteChange(value: object): boolean {
  return Object.keys(value).length > 0;
}

function getIdList(record: Record<string, unknown>, filterPredicate: (value: object) => boolean): string[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(record)
    .filter((entry) => {
      const [, value] = entry;
      return filterPredicate(value as object);
    })
    .map((entry) => {
      const [key] = entry;
      return key;
    });
}

function getDeleteId(path: DeletedPath): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return path.vpnSite;
}

export async function getSiteChanges(data: CalcDiffPayload): Promise<VpnSiteWithStatus[]> {
  const { changes } = data;

  // we get all site ids that were changed
  const createdIds = getIdList(changes.creates.sites, isSiteCreate);
  const updatedIds = getIdList(changes.updates.sites, isSiteChange);
  const deletedIds = (changes.deletes.site as DeletedSite[]).map((site) => getDeleteId(site['path-keys']));

  // we get all config data for every site changed
  const callbacks = unistoreCallbackUtils.getCallbacks;
  const createdPromises = createdIds.map((siteId) => callbacks.getVpnSite(siteId));
  const updatedPromises = updatedIds.map((siteId) => callbacks.getVpnSite(siteId));
  const deletedPromises = deletedIds.map((siteId) => callbacks.getVpnSite(siteId, 'nonconfig'));
  const createdSites = await Promise.all(createdPromises);
  const updatedSites = await Promise.all(updatedPromises);
  const deletedSites = await Promise.all(deletedPromises);

  // we inject status (created/updated/deleted) to every site, that was changed
  const createdSitesWithStatus: VpnSiteWithStatus[] = createdSites
    .map((sites) => apiVpnSitesToClientVpnSite(sites).map((s) => ({ ...s, status: 'CREATED' as Status })))
    .flat();
  const updatedSitesWithStatus: VpnSiteWithStatus[] = updatedSites
    .map((sites) => apiVpnSitesToClientVpnSite(sites).map((s) => ({ ...s, status: 'UPDATED' as Status })))
    .flat();
  const deletedSitesWithStatus: VpnSiteWithStatus[] = deletedSites
    .map((sites) => apiVpnSitesToClientVpnSite(sites).map((s) => ({ ...s, status: 'DELETED' as Status })))
    .flat();

  return [...createdSitesWithStatus, ...updatedSitesWithStatus, ...deletedSitesWithStatus];
}

export function getSavedSitesWithStatus(
  sites: VpnSite[] | null,
  updatedSites: VpnSite[] | null,
  deletedSites: VpnSite[] | null,
): VpnSiteWithStatus[] {
  return (
    sites?.map((site) => {
      const updatedSite = updatedSites?.filter((i) => i.siteId === site.siteId) || [];
      if (updatedSite.length) {
        return {
          ...updatedSite[0],
          status: 'UPDATED',
        };
      }

      const deletedSite = deletedSites?.filter((i) => i.siteId === site.siteId) || [];
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
