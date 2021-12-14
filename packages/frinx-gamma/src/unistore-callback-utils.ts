import {
  ValidProviderIdentifiersOutput,
  VpnBearerOutput,
  VpnNodesOutput,
  VpnServicesOutput,
  VpnSitesOutput,
  VpnCarriersOutput,
  LocationsOutput,
  SiteNetworkAccessOutput,
  SiteDevicesOutput,
  EvcAttachmentItemsOutput,
} from './network-types';
import { VpnService } from './components/forms/service-types';
import { VpnSite } from './components/forms/site-types';
import { VpnBearer, VpnCarrier, VpnNode } from './components/forms/bearer-types';
import { ServiceFilters } from './pages/service-list/service-filter';
import { SiteFilters } from './pages/site-list/site-filter';
import { VpnBearerFilters } from './pages/vpn-bearer-list/vpn-bearer-filter';
import { SiteNetworkAccessFilters } from './pages/site-network-access-list/site-network-access-filter';
import { LocationFilters } from './pages/location-list/location-filter';
import { DeviceFilters } from './pages/device-list/device-filter';
import { EvcFilters } from './pages/evc-list/evc-filter';

export type WorkflowPayload = {
  input?: unknown;
  name: string;
  version: number;
};
export type WorkflowExecPayload = {
  statusCode: number;
  text: string;
};
type Pagination = {
  offset: number;
  limit: number;
};

type ContentType = 'config' | 'nonconfig';

export type UnistoreCallbacks = {
  getVpnServices: (
    pagination: Pagination | null,
    filters: ServiceFilters | null,
    contentType?: ContentType,
  ) => Promise<VpnServicesOutput>;
  editVpnServices: (body: VpnService) => Promise<unknown>;
  deleteVpnService: (id: string) => Promise<unknown>;
  createVpnService: (body: VpnService) => Promise<void>;
  getVpnSites: (
    pagination: Pagination | null,
    filters: SiteFilters | null,
    contentType?: ContentType,
  ) => Promise<VpnSitesOutput>;
  createVpnSite: (body: VpnSite) => Promise<void>;
  editVpnSite: (body: VpnSite) => Promise<void>;
  deleteVpnSite: (id: string) => Promise<void>;
  getValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  getBearerValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  getVpnBearers: (
    pagination: Pagination | null,
    filters: VpnBearerFilters | null,
    contentType?: ContentType,
  ) => Promise<VpnBearerOutput>;
  createVpnBearer: (bearer: VpnBearer) => Promise<void>;
  editVpnBearer: (bearer: VpnBearer) => Promise<void>;
  deleteVpnBearer: (id: string) => Promise<void>;
  getVpnNodes: () => Promise<VpnNodesOutput>;
  editVpnNode: (node: VpnNode) => Promise<void>;
  deleteVpnNode: (nodeId: string) => Promise<void>;
  getVpnCarriers: () => Promise<VpnCarriersOutput>;
  createVpnCarrier: (carrier: VpnCarrier) => Promise<void>;
  editVpnCarrier: (carrier: VpnCarrier) => Promise<void>;
  deleteVpnCarrier: (carrierName: string) => Promise<void>;
  getVpnServiceCount: (filters: ServiceFilters | null, contentType?: ContentType) => Promise<number>;
  getVpnSiteCount: (filters: SiteFilters | null, contentType?: ContentType) => Promise<number>;
  getVpnBearerCount: (filters: VpnBearerFilters | null, contentType?: ContentType) => Promise<number>;
  getLocations: (
    siteId: string,
    pagination: Pagination | null,
    filters: LocationFilters | null,
    contentType?: ContentType,
  ) => Promise<LocationsOutput>;
  getLocationsCount: (siteId: string, filters: LocationFilters, contentType?: ContentType) => Promise<number>;
  getDevices: (
    siteId: string,
    pagination: Pagination | null,
    filters: DeviceFilters | null,
    contentType?: ContentType,
  ) => Promise<SiteDevicesOutput>;
  getDevicesCount: (siteId: string, filters: DeviceFilters, contentType?: ContentType) => Promise<number>;
  getSiteNetworkAccesses: (
    siteId: string,
    pagination: Pagination | null,
    siteNetworkAccessFilter: SiteNetworkAccessFilters | null,
    contentType?: ContentType,
  ) => Promise<SiteNetworkAccessOutput>;
  getSiteNetworkAccessesCount: (
    siteId: string,
    siteNetworkAccessFilter: SiteNetworkAccessFilters | null,
    contentType?: ContentType,
  ) => Promise<number>;
  getTransactionCookie: () => Promise<string>;
  getEvcAttachments: (
    bearerId: string,
    pagination: Pagination | null,
    filters: EvcFilters | null,
    contentType?: ContentType,
  ) => Promise<EvcAttachmentItemsOutput>;
  getEvcAttachmentsCount: (bearerId: string, filters: EvcFilters, contentType?: ContentType) => Promise<number>;
};
class CallbackUtils {
  private callbacks: UnistoreCallbacks | null = null;

  setCallbacks(callbacks: UnistoreCallbacks) {
    this.callbacks = callbacks;
  }

  get getCallbacks() {
    if (this.callbacks == null) {
      throw new Error('callbacks not set');
    }
    return this.callbacks;
  }
}

export default new CallbackUtils();
