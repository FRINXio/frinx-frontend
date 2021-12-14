import { isNumber } from 'fp-ts/lib/number';
import { isString } from 'fp-ts/lib/string';
import {
  sendCookiePostRequest,
  sendDeleteRequest,
  sendGetRequest,
  sendPostRequest,
  sendPutRequest,
  UNISTORE_AUTH,
} from './api-helpers';
import {
  clientBearerToApiBearer,
  clientVpnCarrierToApiVpnCarrier,
  clientVpnNodeToApiVpnNode,
  clientVpnServiceToApiVpnService,
  clientVpnSiteToApiVpnSite,
} from './converters';
import {
  getServiceFilterParams,
  getSiteFilterParams,
  getSiteNetworkAccessFilterParams,
  getVpnBearerFilterParams,
  getLocationFilterParams,
  ServiceFilter,
  SiteFilter,
  SiteNetworkAccessFilter,
  VpnBearerFilter,
  LocationFilter,
  DeviceFilter,
  EvcFilter,
  getDeviceFilterParams,
  getEvcFilterParams,
} from './filter-helpers';
import {
  decodeEvcAttachmentItemsOutput,
  decodeLocationsOutput,
  decodeSiteDevicesOutput,
  decodeSiteNetworkAccessOutput,
  decodeValidProviderIdentifiersOutput,
  decodeVpnBearerOutput,
  decodeVpnCarriersOutput,
  decodeVpnNodesOutput,
  decodeVpnServicesOutput,
  decodeVpnSitesOutput,
  EvcAttachmentItemsOutput,
  LocationsOutput,
  SiteDevicesOutput,
  SiteNetworkAccessOutput,
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
} from './network-types';

// data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers
const UNICONFIG_SERVICE_URL =
  '/data/network-topology:network-topology/topology=unistore/node=service/frinx-uniconfig-topology:configuration';

type Pagination = {
  offset: number;
  limit: number;
};

type ContentType = 'config' | 'nonconfig';

function getContentParameter(contentType?: ContentType): string {
  return contentType ? `content=${contentType}` : 'content=config';
}

// used in PUT and POST service parameter
const SERVICE_SCHEMA_PARAMETER = 'uniconfig-schema-repository=service';
// used in PUT and POST bearer parameter
const BEARER_SCHEMA_PARAMETER = 'uniconfig-schema-repository=bearer';

export async function getVpnServices(
  pagination: Pagination | null,
  serviceFilter: ServiceFilter | null,
  contentType?: ContentType,
): Promise<VpnServicesOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const filterParams = serviceFilter ? getServiceFilterParams(serviceFilter) : '';
    const content = getContentParameter(contentType);
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service?${content}${paginationParams}${filterParams}`,
    );
    const data = decodeVpnServicesOutput(json);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      'vpn-service': [],
    };
  }
}

export async function editVpnServices(vpnService: VpnService): Promise<unknown> {
  const body = clientVpnServiceToApiVpnService(vpnService);
  const json = await sendPutRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnService.vpnId}?${SERVICE_SCHEMA_PARAMETER}`,
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
  await sendPostRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services?${SERVICE_SCHEMA_PARAMETER}`,
    body,
  );
}

export async function getVpnSites(
  pagination: Pagination | null,
  siteFilter: SiteFilter | null,
  contentType?: ContentType,
): Promise<VpnSitesOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const filterParams = siteFilter ? getSiteFilterParams(siteFilter) : '';
    const content = getContentParameter(contentType);
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site?${content}${paginationParams}${filterParams}`,
    );
    const data = decodeVpnSitesOutput(json);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      site: [],
    };
  }
}

export async function createVpnSite(vpnSite: VpnSite): Promise<void> {
  const body = clientVpnSiteToApiVpnSite(vpnSite);
  await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites?${SERVICE_SCHEMA_PARAMETER}`, body);
}

export async function editVpnSite(vpnSite: VpnSite): Promise<void> {
  const body = clientVpnSiteToApiVpnSite(vpnSite);
  await sendPutRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSite.siteId}?${SERVICE_SCHEMA_PARAMETER}`,
    body,
  );
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
  vpnBearerFilter: VpnBearerFilter | null,
  contentType?: ContentType,
): Promise<VpnBearerOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const filterParams = vpnBearerFilter ? getVpnBearerFilterParams(vpnBearerFilter) : '';
    const content = getContentParameter(contentType);
    const json = await sendGetRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer?${content}${paginationParams}${filterParams}`,
    );
    const data = decodeVpnBearerOutput(json);

    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      'vpn-bearer': [],
    };
  }
}

export async function createVpnBearer(bearer: VpnBearer): Promise<void> {
  const body = clientBearerToApiBearer(bearer);
  await sendPostRequest(
    `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers?${BEARER_SCHEMA_PARAMETER}`,
    body,
  );
}

export async function editVpnBearer(vpnBearer: VpnBearer): Promise<void> {
  const body = clientBearerToApiBearer(vpnBearer);
  await sendPutRequest(
    `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${vpnBearer.spBearerReference}?${BEARER_SCHEMA_PARAMETER}`,
    body,
  );
}

export async function deleteVpnBearer(id: string): Promise<void> {
  await sendDeleteRequest(
    `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${id}`,
  );
}

export async function getVpnNodes(): Promise<VpnNodesOutput> {
  try {
    const json = await sendGetRequest(
      '/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes',
    );
    const data = decodeVpnNodesOutput(json);

    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      'vpn-nodes': {
        'vpn-node': [],
      },
    };
  }
}

export async function editVpnNode(node: VpnNode): Promise<void> {
  const body = clientVpnNodeToApiVpnNode(node);
  await sendPutRequest(
    `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${node.neId}`,
    body,
  );
}

export async function deleteVpnNode(nodeId: string): Promise<void> {
  await sendDeleteRequest(
    `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${nodeId}`,
  );
}

export async function getVpnCarriers(): Promise<VpnCarriersOutput> {
  try {
    const json = await sendGetRequest(
      '/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers',
    );
    const data = decodeVpnCarriersOutput(json);

    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      carriers: {
        carrier: [],
      },
    };
  }
}

export async function createVpnCarrier(carrier: VpnCarrier): Promise<void> {
  const body = clientVpnCarrierToApiVpnCarrier(carrier);
  await sendPostRequest(
    '/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers',
    body,
  );
}

export async function editVpnCarrier(carrier: VpnCarrier): Promise<void> {
  const body = clientVpnCarrierToApiVpnCarrier(carrier);
  await sendPutRequest(
    `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrier.name}`,
    body,
  );
}

export async function deleteVpnCarrier(carrierId: string): Promise<void> {
  await sendDeleteRequest(
    `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrierId}`,
  );
}

export async function getBearerValidProviderIdentifiers(): Promise<ValidProviderIdentifiersOutput> {
  try {
    const json = await sendGetRequest(
      '/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/valid-provider-identifiers',
    );
    const data = decodeValidProviderIdentifiersOutput(json);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      'valid-provider-identifiers': {
        'bfd-profile-identifier': [],
        'qos-profile-identifier': [],
        'bgp-profile-identifier': [],
      },
    };
  }
}

export async function getVpnServiceCount(
  serviceFilter: ServiceFilter | null,
  contentType?: ContentType,
): Promise<number> {
  try {
    const filterParams = serviceFilter ? getServiceFilterParams(serviceFilter) : '';
    const content = getContentParameter(contentType);
    const data = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service?${content}&fetch=count${filterParams}`,
    );
    if (!isNumber(data)) {
      throw new Error('not a number');
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return 0;
  }
}

export async function getVpnSiteCount(siteFilter: SiteFilter | null, contentType?: ContentType): Promise<number> {
  try {
    const filterParams = siteFilter ? getSiteFilterParams(siteFilter) : '';
    const content = getContentParameter(contentType);
    const data = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site?${content}&fetch=count${filterParams}`,
    );
    if (!isNumber(data)) {
      throw new Error('not a number');
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return 0;
  }
}

export async function getVpnBearerCount(
  vpnBearerFilter: VpnBearerFilter | null,
  contentType?: ContentType,
): Promise<number> {
  try {
    const filterParams = vpnBearerFilter ? getVpnBearerFilterParams(vpnBearerFilter) : '';
    const content = getContentParameter(contentType);
    const data = await sendGetRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer?${content}&fetch=count${filterParams}`,
    );
    if (!isNumber(data)) {
      throw new Error('not a number');
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return 0;
  }
}

export async function getLocations(
  siteId: string,
  pagination: Pagination | null,
  locationFilter: LocationFilter | null,
  contentType?: ContentType,
): Promise<LocationsOutput> {
  try {
    const filterParams = locationFilter ? getLocationFilterParams(locationFilter) : '';
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const content = getContentParameter(contentType);
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/locations/location?${content}${paginationParams}${filterParams}`,
    );
    const data = decodeLocationsOutput(json);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // if site does not have locations it the response is 404
    return { location: [] };
  }
}

export async function getLocationsCount(
  siteId: string,
  locationFilter: LocationFilter | null,
  contentType?: ContentType,
): Promise<number> {
  try {
    const filterParams = locationFilter ? getLocationFilterParams(locationFilter) : '';
    const content = getContentParameter(contentType);
    const data = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/locations/location?${content}${filterParams}&fetch=count`,
    );
    if (!isNumber(data)) {
      throw new Error('not a number');
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return 0;
  }
}

export async function getDevices(
  siteId: string,
  pagination: Pagination | null,
  deviceFilter: DeviceFilter | null,
  contentType?: ContentType,
): Promise<SiteDevicesOutput> {
  try {
    const filterParams = deviceFilter ? getDeviceFilterParams(deviceFilter) : '';
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const content = getContentParameter(contentType);
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/devices/device?${content}${paginationParams}${filterParams}`,
    );
    const data = decodeSiteDevicesOutput(json);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // if site does not have locations it the response is 404
    return { device: [] };
  }
}

export async function getDevicesCount(
  siteId: string,
  deviceFilter: DeviceFilter | null,
  contentType?: ContentType,
): Promise<number> {
  try {
    const filterParams = deviceFilter ? getDeviceFilterParams(deviceFilter) : '';
    const content = getContentParameter(contentType);
    const data = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/devices/device?${content}${filterParams}&fetch=count`,
    );
    if (!isNumber(data)) {
      throw new Error('not a number');
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return 0;
  }
}

export async function getSiteNetworkAccesses(
  siteId: string,
  pagination: Pagination | null,
  siteNetworkAccessFilter: SiteNetworkAccessFilter | null,
  contentType?: ContentType,
): Promise<SiteNetworkAccessOutput> {
  try {
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const filterParams = siteNetworkAccessFilter ? getSiteNetworkAccessFilterParams(siteNetworkAccessFilter) : '';
    const content = getContentParameter(contentType);
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/site-network-accesses/site-network-access?${content}${paginationParams}${filterParams}`,
    );
    const data = decodeSiteNetworkAccessOutput(json);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // if site does not have locations it the response is 404
    return { 'site-network-access': [] };
  }
}

export async function getSiteNetworkAccessesCount(
  siteId: string,
  siteNetworkAccessFilter: SiteNetworkAccessFilter | null,
  contentType?: ContentType,
): Promise<number> {
  try {
    const filterParams = siteNetworkAccessFilter ? getSiteNetworkAccessFilterParams(siteNetworkAccessFilter) : '';
    const content = getContentParameter(contentType);
    const data = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/site-network-accesses/site-network-access?${content}&fetch=count${filterParams}`,
    );
    if (!isNumber(data)) {
      throw new Error('not a number');
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return 0;
  }
}

export async function getEvcAttachments(
  bearerId: string,
  pagination: Pagination | null,
  evcFilter: EvcFilter | null,
  contentType?: ContentType,
): Promise<EvcAttachmentItemsOutput> {
  try {
    const filterParams = evcFilter ? getEvcFilterParams(evcFilter) : '';
    const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : '';
    const content = getContentParameter(contentType);
    const json = await sendGetRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${bearerId}/evc-attachments/evc-attachment?${BEARER_SCHEMA_PARAMETER}&${content}${paginationParams}${filterParams}`,
    );
    const data = decodeEvcAttachmentItemsOutput(json);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // if site does not have locations it the response is 404
    return { 'evc-attachment': [] };
  }
}

export async function getEvcAttachmentsCount(
  bearerId: string,
  locationFilter: LocationFilter | null,
  contentType?: ContentType,
): Promise<number> {
  try {
    const filterParams = locationFilter ? getLocationFilterParams(locationFilter) : '';
    const content = getContentParameter(contentType);
    const data = await sendGetRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${bearerId}/evc-attachments/evc-attachment?${BEARER_SCHEMA_PARAMETER}&fetch=count&${content}${filterParams}`,
    );
    if (!isNumber(data)) {
      throw new Error('not a number');
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return 0;
  }
}

export async function getTransactionCookie(): Promise<string> {
  const data = await sendCookiePostRequest('/operations/uniconfig-manager:create-transaction', {
    auth: UNISTORE_AUTH,
    verify: false,
  });
  if (!isString(data)) {
    throw new Error('not a string');
  }
  return data;
}
