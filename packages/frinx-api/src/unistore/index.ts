import { isNumber } from 'fp-ts/lib/number';
import { isString } from 'fp-ts/lib/string';
import { ApiHelpers } from '../api-helpers';
import {
  getLocationFilterParams,
  getServiceFilterParams,
  getSiteFilterParams,
  getSiteNetworkAccessFilterParams,
  getVpnBearerFilterParams,
  LocationFilter,
  ServiceFilter,
  SiteFilter,
  SiteNetworkAccessFilter,
  VpnBearerFilter,
} from './filter.helpers';
import {
  CreateVpnServiceInput,
  CreateVpnSiteInput,
  decodeLocationsOutput,
  decodeSiteNetworkAccessOutput,
  decodeValidProviderIdentifiersOutput,
  decodeVpnBearerOutput,
  decodeVpnCarriersOutput,
  decodeVpnNodesOutput,
  decodeVpnServicesOutput,
  decodeVpnSitesOutput,
  LocationsOutput,
  SiteNetworkAccessOutput,
  ValidProviderIdentifiersOutput,
  VpnBearerInput,
  VpnBearerOutput,
  VpnCarrierInput,
  VpnCarriersOutput,
  VpnNodeInput,
  VpnNodesOutput,
  VpnServicesOutput,
  VpnSitesOutput,
} from './types';

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

export type UnistoreApiClient = {
  getVpnServices: (
    pagination: Pagination | null,
    serviceFilter: ServiceFilter | null,
    contentType?: ContentType,
  ) => Promise<VpnServicesOutput>;
  editVpnServices: (vpnService: CreateVpnServiceInput) => Promise<unknown>;
  deleteVpnService: (vpnServiceId: string) => Promise<unknown>;
  createVpnService: (vpnService: CreateVpnServiceInput) => Promise<void>;
  getVpnSites: (
    pagination: Pagination | null,
    siteFilter: SiteFilter | null,
    contentType?: ContentType,
  ) => Promise<VpnSitesOutput>;
  createVpnSite: (vpnSite: CreateVpnSiteInput) => Promise<void>;
  editVpnSite: (vpnSite: CreateVpnSiteInput) => Promise<void>;
  deleteVpnSite: (vpnSiteId: string) => Promise<void>;
  getValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  getVpnBearers: (
    pagination: Pagination | null,
    vpnBearerFilter: VpnBearerFilter | null,
    contentType?: ContentType,
  ) => Promise<VpnBearerOutput>;
  createVpnBearer: (bearer: VpnBearerInput) => Promise<void>;
  editVpnBearer: (bearer: VpnBearerInput) => Promise<void>;
  deleteVpnBearer: (id: string) => Promise<void>;
  getVpnNodes: () => Promise<VpnNodesOutput>;
  editVpnNode: (node: VpnNodeInput) => Promise<void>;
  deleteVpnNode: (nodeId: string) => Promise<void>;
  getVpnCarriers: () => Promise<VpnCarriersOutput>;
  createVpnCarrier: (carrier: VpnCarrierInput) => Promise<void>;
  editVpnCarrier: (carrier: VpnCarrierInput) => Promise<void>;
  deleteVpnCarrier: (carrierId: string) => Promise<void>;
  getBearerValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  getVpnServiceCount: (serviceFilter: ServiceFilter | null, contentType?: ContentType) => Promise<number>;
  getVpnSiteCount: (siteFilter: SiteFilter | null, contentType?: ContentType) => Promise<number>;
  getVpnBearerCount: (vpnBearerFilter: VpnBearerFilter | null, contentType?: ContentType) => Promise<number>;
  getLocations: (
    siteId: string,
    pagination: Pagination | null,
    filters: LocationFilter | null,
    contentType?: ContentType,
  ) => Promise<LocationsOutput>;
  getLocationsCount: (siteId: string, filters: LocationFilter, contentType?: ContentType) => Promise<number>;
  getSiteNetworkAccesses: (
    siteId: string,
    pagination: Pagination | null,
    siteNetworkAccessFilter: SiteNetworkAccessFilter | null,
    contentType?: ContentType,
  ) => Promise<SiteNetworkAccessOutput>;
  getSiteNetworkAccessesCount: (
    siteId: string,
    siteNetworkAccessFilter: SiteNetworkAccessFilter | null,
    contentType?: ContentType,
  ) => Promise<number>;
  getTransactionCookie: () => Promise<string>;
};

export default function createUnistoreApiClient(apiHelpers: ApiHelpers, unistoreAuthToken: string): UnistoreApiClient {
  const { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } = apiHelpers;

  async function getVpnServices(
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

  async function editVpnServices(vpnService: CreateVpnServiceInput): Promise<unknown> {
    const json = await sendPutRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnService['vpn-service'][0]['vpn-id']}`,
      vpnService,
    );
    return json;
  }

  async function deleteVpnService(vpnServiceId: string): Promise<unknown> {
    const json = await sendDeleteRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnServiceId}`,
    );
    return json;
  }

  async function createVpnService(vpnService: CreateVpnServiceInput): Promise<void> {
    await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services`, vpnService);
  }

  async function getVpnSites(
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

  async function createVpnSite(vpnSite: CreateVpnSiteInput): Promise<void> {
    await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites`, vpnSite);
  }

  async function editVpnSite(vpnSite: CreateVpnSiteInput): Promise<void> {
    await sendPutRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSite.site[0]['site-id']}`,
      vpnSite,
    );
  }

  async function deleteVpnSite(vpnSiteId: string): Promise<void> {
    await sendDeleteRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSiteId}?content=config`,
    );
  }

  async function getValidProviderIdentifiers(): Promise<ValidProviderIdentifiersOutput> {
    const json = await sendGetRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-profiles/valid-provider-identifiers`,
    );
    const data = decodeValidProviderIdentifiersOutput(json);
    return data;
  }

  async function getVpnBearers(
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

  async function createVpnBearer(bearer: VpnBearerInput): Promise<void> {
    await sendPostRequest(
      '/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers',
      bearer,
    );
  }

  async function editVpnBearer(bearer: VpnBearerInput): Promise<void> {
    await sendPutRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${bearer['vpn-bearer'][0]['sp-bearer-reference']}`,
      bearer,
    );
  }

  async function deleteVpnBearer(id: string): Promise<void> {
    await sendDeleteRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${id}`,
    );
  }

  async function getVpnNodes(): Promise<VpnNodesOutput> {
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

  async function editVpnNode(node: VpnNodeInput): Promise<void> {
    await sendPutRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${node['vpn-node'][0]['ne-id']}`,
      node,
    );
  }

  async function deleteVpnNode(nodeId: string): Promise<void> {
    await sendDeleteRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${nodeId}`,
    );
  }

  async function getVpnCarriers(): Promise<VpnCarriersOutput> {
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

  async function createVpnCarrier(carrier: VpnCarrierInput): Promise<void> {
    await sendPostRequest(
      '/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers',
      carrier,
    );
  }

  async function editVpnCarrier(carrier: VpnCarrierInput): Promise<void> {
    await sendPutRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrier.carrier[0]['carrier-name']}`,
      carrier,
    );
  }

  async function deleteVpnCarrier(carrierId: string): Promise<void> {
    await sendDeleteRequest(
      `/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrierId}`,
    );
  }

  async function getBearerValidProviderIdentifiers(): Promise<ValidProviderIdentifiersOutput> {
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

  async function getVpnServiceCount(serviceFilter: ServiceFilter | null, contentType?: ContentType): Promise<number> {
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

  async function getVpnSiteCount(siteFilter: SiteFilter | null, contentType?: ContentType): Promise<number> {
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

  async function getVpnBearerCount(
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

  async function getLocations(
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

  async function getLocationsCount(
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

  async function getSiteNetworkAccesses(
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

  async function getSiteNetworkAccessesCount(
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

  async function getTransactionCookie(): Promise<string> {
    const response = await sendPostRequest('/operations/uniconfig-manager:create-transaction', {
      auth: unistoreAuthToken,
      verify: false,
    });
    const data = await (response as Response).text();
    if (!isString(data)) {
      throw new Error('not a string');
    }
    return data;
  }

  return {
    getVpnServices,
    editVpnServices,
    deleteVpnService,
    createVpnService,
    getVpnSites,
    createVpnSite,
    editVpnSite,
    deleteVpnSite,
    getValidProviderIdentifiers,
    getVpnBearers,
    createVpnBearer,
    editVpnBearer,
    deleteVpnBearer,
    getVpnNodes,
    editVpnNode,
    deleteVpnNode,
    getVpnCarriers,
    createVpnCarrier,
    editVpnCarrier,
    deleteVpnCarrier,
    getBearerValidProviderIdentifiers,
    getVpnServiceCount,
    getVpnSiteCount,
    getVpnBearerCount,
    getLocations,
    getLocationsCount,
    getSiteNetworkAccesses,
    getSiteNetworkAccessesCount,
    getTransactionCookie,
  };
}
