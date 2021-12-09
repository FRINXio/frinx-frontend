import { SiteNetworkAccess } from '../../components/forms/site-types';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

export type SiteNetworkAccessWithStatus = SiteNetworkAccess & { status: Status };

export function getChangedNetworkAccessesWithStatus(
  createdNetworkAccesses: SiteNetworkAccess[] | null,
  updatedNetworkAccesses: SiteNetworkAccess[] | null,
  deletedNetworkAccesses: SiteNetworkAccess[] | null,
): SiteNetworkAccessWithStatus[] {
  const createdNetworkAccessesWithStatus: SiteNetworkAccessWithStatus[] =
    createdNetworkAccesses?.map((Site) => {
      return {
        ...Site,
        status: 'CREATED',
      };
    }) || [];

  const updatedNetworkAccessesWithStatus: SiteNetworkAccessWithStatus[] =
    updatedNetworkAccesses?.map((Site) => {
      return {
        ...Site,
        status: 'UPDATED',
      };
    }) || [];

  const deletedNetworkAccessesWithStatus: SiteNetworkAccessWithStatus[] =
    deletedNetworkAccesses?.map((Site) => {
      return {
        ...Site,
        status: 'DELETED',
      };
    }) || [];

  return [
    ...createdNetworkAccessesWithStatus,
    ...updatedNetworkAccessesWithStatus,
    ...deletedNetworkAccessesWithStatus,
  ];
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
