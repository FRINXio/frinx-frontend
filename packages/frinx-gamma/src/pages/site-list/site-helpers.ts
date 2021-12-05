import { VpnSite } from '../../components/forms/site-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type VpnSiteWithStatus = VpnSite & { status: Status };

export function getChangedSitesWithStatus(
  createdSites: VpnSite[] | null,
  updatedSites: VpnSite[] | null,
  deletedSites: VpnSite[] | null,
): VpnSiteWithStatus[] {
  const createdSitesWithStatus: VpnSiteWithStatus[] =
    createdSites?.map((Site) => {
      return {
        ...Site,
        status: 'CREATED',
      };
    }) || [];

  const updatedSitesWithStatus: VpnSiteWithStatus[] =
    updatedSites?.map((Site) => {
      return {
        ...Site,
        status: 'UPDATED',
      };
    }) || [];

  const deletedSitesWithStatus: VpnSiteWithStatus[] =
    deletedSites?.map((Site) => {
      return {
        ...Site,
        status: 'DELETED',
      };
    }) || [];

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
