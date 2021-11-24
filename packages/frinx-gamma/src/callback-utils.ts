import {
  ValidProviderIdentifiersOutput,
  VpnBearerOutput,
  VpnNodesOutput,
  VpnServicesOutput,
  VpnSitesOutput,
  VpnCarriersOutput,
  LocationsOutput,
  SiteNetworkAccessOutput,
} from './network-types';
import { VpnService } from './components/forms/service-types';
import { VpnSite } from './components/forms/site-types';
import { VpnBearer, VpnCarrier, VpnNode } from './components/forms/bearer-types';
import { ServiceFilters } from './pages/service-list/service-filter';
import { SiteFilters } from './pages/site-list/site-filter';
import { VpnBearerFilters } from './pages/vpn-bearer-list/vpn-bearer-filter';
import { SiteNetworkAccessFilters } from './pages/site-network-access-list/site-network-access-filter';

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

export type Callbacks = {
  getVpnServices: (pagination: Pagination | null, filters: ServiceFilters | null) => Promise<VpnServicesOutput>;
  editVpnServices: (body: VpnService) => Promise<unknown>;
  deleteVpnService: (id: string) => Promise<unknown>;
  createVpnService: (body: VpnService) => Promise<void>;
  getVpnSites: (pagination: Pagination | null, filters: SiteFilters | null) => Promise<VpnSitesOutput>;
  createVpnSite: (body: VpnSite) => Promise<void>;
  editVpnSite: (body: VpnSite) => Promise<void>;
  deleteVpnSite: (id: string) => Promise<void>;
  getValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  getBearerValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  executeWorkflow: (payload: WorkflowPayload) => Promise<WorkflowExecPayload>;
  getWorkflowInstanceDetail: (workflowId: string, options?: RequestInit) => Promise<unknown>;
  getVpnBearers: (pagination: Pagination | null, filters: VpnBearerFilters | null) => Promise<VpnBearerOutput>;
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
  getVpnServiceCount: (filters: ServiceFilters | null) => Promise<number>;
  getVpnSiteCount: (filters: SiteFilters | null) => Promise<number>;
  getVpnBearerCount: (filters: VpnBearerFilters | null) => Promise<number>;
  getLocations: (siteId: string, pagiantion?: Pagination) => Promise<LocationsOutput>;
  getLocationsCount: (siteId: string) => Promise<number>;
  getSiteNetworkAccesses: (
    siteId: string,
    pagination: Pagination | null,
    siteNetworkAccessFilter: SiteNetworkAccessFilters | null,
  ) => Promise<SiteNetworkAccessOutput>;
  getSiteNetworkAccessesCount: (
    siteId: string,
    siteNetworkAccessFilter: SiteNetworkAccessFilters | null,
  ) => Promise<number>;
  getTransactionCookie: () => Promise<string>;
};
class CallbackUtils {
  private callbacks: Callbacks | null = null;

  setCallbacks(callbacks: Callbacks) {
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
