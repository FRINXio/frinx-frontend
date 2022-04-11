import {
  CreateVpnServiceInput,
  CreateVpnSiteInput,
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
  SiteDevicesOutput,
  EvcAttachmentItemsOutput,
  VpnSiteOutput,
} from './network-types';
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
    serviceFilter: ServiceFilters | null,
    contentType?: ContentType,
  ) => Promise<VpnServicesOutput>;
  getVpnService: (serviceId: string, contentType?: ContentType) => Promise<VpnServicesOutput>;
  editVpnServices: (vpnService: CreateVpnServiceInput) => Promise<unknown>;
  deleteVpnService: (vpnServiceId: string) => Promise<unknown>;
  createVpnService: (vpnService: CreateVpnServiceInput) => Promise<void>;
  getVpnSites: (
    pagination: Pagination | null,
    siteFilter: SiteFilters | null,
    contentType?: ContentType,
  ) => Promise<VpnSitesOutput>;
  getVpnSite: (siteId: string, contentType?: ContentType) => Promise<VpnSiteOutput>;
  createVpnSite: (vpnSite: CreateVpnSiteInput) => Promise<void>;
  editVpnSite: (vpnSite: CreateVpnSiteInput) => Promise<void>;
  deleteVpnSite: (vpnSiteId: string) => Promise<void>;
  getValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  getVpnBearers: (
    pagination: Pagination | null,
    vpnBearerFilter: VpnBearerFilters | null,
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
  getVpnServiceCount: (serviceFilter: ServiceFilters | null, contentType?: ContentType) => Promise<number>;
  getVpnSiteCount: (siteFilter: SiteFilters | null, contentType?: ContentType) => Promise<number>;
  getVpnBearerCount: (vpnBearerFilter: VpnBearerFilters | null, contentType?: ContentType) => Promise<number>;
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
  closeTransaction: () => Promise<void>;
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
