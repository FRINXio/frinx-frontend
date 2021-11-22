import { isNumber } from 'fp-ts/lib/number';
import { sendDeleteRequest, sendGetRequest, sendPostRequest, sendPutRequest } from './api-helpers';
import {
  clientBearerToApiBearer,
  clientVpnCarrierToApiVpnCarrier,
  clientVpnNodeToApiVpnNode,
  clientVpnServiceToApiVpnService,
  clientVpnSiteToApiVpnSite,
} from './converters';
import {
  decodeValidProviderIdentifiersOutput,
  decodeVpnBearerOutput,
  decodeVpnCarriersOutput,
  decodeVpnNodesOutput,
  decodeVpnServicesOutput,
  decodeVpnSitesOutput,
  decodeLocationsOutput,
  decodeSiteNetworkAccessOutput,
  ValidProviderIdentifiersOutput,
  VpnBearer,
  VpnBearerOutput,
  VpnCarrier,
  VpnCarriersOutput,
  VpnNode,
  VpnNodesOutput,
  VpnService,
  VpnServicesOutput,
  VpnSite,
  VpnSitesOutput,
  LocationsOutput,
  SiteNetworkAccessOutput,
} from './network-types';

// data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers
const UNICONFIG_SERVICE_URL =
  '/data/network-topology:network-topology/topology=uniconfig/node=service/frinx-uniconfig-topology:configuration';

type Pagination = {
  offset: number;
  limit: number;
};

type ServiceFilter = {
  id: string | null;
  customerName: string | null;
};

type SiteFilter = {
  id: string | null;
  locationId: string | null;
  deviceId: string | null;
};

type VpnBearerFilter = {
  id: string | null;
  description: string | null;
};

// we filter non null filters and joined them with && operator
function joinNonNullFilters(filters: (string | null)[]): string {
  const separator = encodeURIComponent('&&'); // AND operator must be url encoded
  return filters.filter((f) => f !== null).join(separator);
}

function getServiceFilterParams(serviceFilter: ServiceFilter): string {
  const filters = [];
  filters.push(serviceFilter.id ? `@."vpn-id"like_regex"${serviceFilter.id}"` : null);
  filters.push(serviceFilter.customerName ? `@."customer-name"like_regex"${serviceFilter.customerName}"` : null);
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

function getSiteFilterParams(siteFilter: SiteFilter): string {
  const filters = [];
  filters.push(siteFilter.id ? `@."site-id"like_regex"${siteFilter.id}"` : null);
  filters.push(
    siteFilter.locationId
      ? `exists({@/locations/location}[*]  ? (@."location-id"like_regex"${siteFilter.locationId}"))`
      : null,
  );
  filters.push(
    siteFilter.deviceId ? `exists({@/devices/device}[*]  ? (@."device-id"like_regex"${siteFilter.deviceId}"))` : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

function getVpnBearerFilterParams(vpnBearerFilter: VpnBearerFilter): string {
  const filters = [];
  filters.push(vpnBearerFilter.id ? `@."sp-bearer-reference"like_regex"${vpnBearerFilter.id}"` : null);
  filters.push(vpnBearerFilter.description ? `@."description"like_regex"${vpnBearerFilter.description}"` : null);
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export async function getVpnServices(
  pagination?: Pagination,
  serviceFilter?: ServiceFilter,
): Promise<VpnServicesOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const filterParams = serviceFilter ? getServiceFilterParams(serviceFilter) : '';
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service?content=config${paginationParams}${filterParams}`,
    );
    const data = decodeVpnServicesOutput(json);
    return data;
  } catch {
    return {
      'vpn-service': [],
    };
  }
}

export async function editVpnServices(vpnService: VpnService): Promise<unknown> {
  const body = clientVpnServiceToApiVpnService(vpnService);
  const json = await sendPutRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnService.vpnId}`,
    body,
  );
  return json;
}

export async function deleteVpnService(vpnServiceId: string): Promise<unknown> {
  const json = await sendDeleteRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnServiceId}`,
  );
  return json;
}

export async function createVpnService(vpnService: VpnService): Promise<void> {
  const body = clientVpnServiceToApiVpnService(vpnService);
  await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services`, body);
}

export async function getVpnSites(
  pagination: Pagination | null,
  siteFilter: SiteFilter | null,
): Promise<VpnSitesOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const filterParams = siteFilter ? getSiteFilterParams(siteFilter) : '';
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site?content=config${paginationParams}${filterParams}`,
    );
    const data = decodeVpnSitesOutput(json);
    return data;
  } catch {
    return {
      site: [],
    };
  }
}

export async function createVpnSite(vpnSite: VpnSite): Promise<void> {
  const body = clientVpnSiteToApiVpnSite(vpnSite);
  await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites`, body);
}

export async function editVpnSite(vpnSite: VpnSite): Promise<void> {
  const body = clientVpnSiteToApiVpnSite(vpnSite);
  await sendPutRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSite.siteId}`, body);
}

export async function deleteVpnSite(vpnSiteId: string): Promise<void> {
  await sendDeleteRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSiteId}?content=config`);
}

export async function getValidProviderIdentifiers(): Promise<ValidProviderIdentifiersOutput> {
  const json = await sendGetRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-profiles/valid-provider-identifiers`,
  );
  const data = decodeValidProviderIdentifiersOutput(json);
  return data;
}

export async function getVpnBearers(
  pagination: Pagination | null,
  vpnBearerFilter: VpnBearerFilter,
): Promise<VpnBearerOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const filterParams = vpnBearerFilter ? getVpnBearerFilterParams(vpnBearerFilter) : '';
    const json = await sendGetRequest(
      `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer?content=config${paginationParams}${filterParams}`,
    );
    const data = decodeVpnBearerOutput(json);

    return data;
  } catch {
    return {
      'vpn-bearer': [],
    };
  }
}

export async function createVpnBearer(bearer: VpnBearer): Promise<void> {
  const body = clientBearerToApiBearer(bearer);
  await sendPostRequest(
    '/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers',
    body,
  );
}

export async function editVpnBearer(vpnBearer: VpnBearer): Promise<unknown> {
  const body = clientBearerToApiBearer(vpnBearer);
  const json = await sendPutRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${vpnBearer.spBearerReference}`,
    body,
  );
  return json;
}

export async function deleteVpnBearer(id: string): Promise<void> {
  await sendDeleteRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${id}`,
  );
}

export async function getVpnNodes(): Promise<VpnNodesOutput> {
  const json = await sendGetRequest(
    '/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes',
  );
  const data = decodeVpnNodesOutput(json);

  return data;
}

export async function editVpnNode(node: VpnNode): Promise<void> {
  const body = clientVpnNodeToApiVpnNode(node);
  await sendPutRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${node.neId}`,
    body,
  );
}

export async function deleteVpnNode(nodeId: string): Promise<void> {
  await sendDeleteRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${nodeId}`,
  );
}

export async function getVpnCarriers(): Promise<VpnCarriersOutput> {
  const json = await sendGetRequest(
    '/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers',
  );
  const data = decodeVpnCarriersOutput(json);

  return data;
}

export async function createVpnCarrier(carrier: VpnCarrier): Promise<void> {
  const body = clientVpnCarrierToApiVpnCarrier(carrier);
  await sendPostRequest(
    '/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers',
    body,
  );
}

export async function editVpnCarrier(carrier: VpnCarrier): Promise<void> {
  const body = clientVpnCarrierToApiVpnCarrier(carrier);
  await sendPutRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrier.name}`,
    body,
  );
}

export async function deleteVpnCarrier(carrierId: string): Promise<void> {
  await sendDeleteRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrierId}`,
  );
}

export async function getBearerValidProviderIdentifiers(): Promise<ValidProviderIdentifiersOutput> {
  const json = await sendGetRequest(
    '/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/valid-provider-identifiers',
  );
  const data = decodeValidProviderIdentifiersOutput(json);
  return data;
}

export async function getVpnServiceCount(serviceFilter: ServiceFilter | null): Promise<number> {
  const filterParams = serviceFilter ? getServiceFilterParams(serviceFilter) : '';
  const data = await sendGetRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service?content=config&fetch=count${filterParams}`,
  );
  if (!isNumber(data)) {
    throw new Error('not a number');
  }
  return data;
}

export async function getVpnSiteCount(siteFilter: SiteFilter): Promise<number> {
  const filterParams = siteFilter ? getSiteFilterParams(siteFilter) : '';
  const data = await sendGetRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site?content=config&fetch=count${filterParams}`,
  );
  if (!isNumber(data)) {
    throw new Error('not a number');
  }
  return data;
}

export async function getVpnBearerCount(vpnBearerFilter: VpnBearerFilter): Promise<number> {
  const filterParams = vpnBearerFilter ? getVpnBearerFilterParams(vpnBearerFilter) : '';
  const data = await sendGetRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer?content=config&fetch=count${filterParams}`,
  );
  if (!isNumber(data)) {
    throw new Error('not a number');
  }
  return data;
}

export async function getLocations(siteId: string, pagination?: Pagination): Promise<LocationsOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/locations/location?content=config${paginationParams}`,
    );
    const data = decodeLocationsOutput(json);
    return data;
  } catch {
    // if site does not have locations it the response is 404
    return { location: [] };
  }
}

export async function getLocationsCount(siteId: string): Promise<number> {
  const data = await sendGetRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/locations/location?content=config&fetch=count`,
  );
  if (!isNumber(data)) {
    throw new Error('not a number');
  }
  return data;
}

export async function getSiteNetworkAccesses(
  siteId: string,
  pagination?: Pagination,
): Promise<SiteNetworkAccessOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/site-network-accesses/site-network-access?content=config${paginationParams}`,
    );
    const data = decodeSiteNetworkAccessOutput(json);
    return data;
  } catch {
    // if site does not have locations it the response is 404
    return { 'site-network-access': [] };
  }
}

export async function getSiteNetworkAccessesCount(siteId: string): Promise<number> {
  const data = await sendGetRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/site-network-accesses/site-network-access?content=config&fetch=count`,
  );
  if (!isNumber(data)) {
    throw new Error('not a number');
  }
  return data;
}
