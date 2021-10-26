import {
  ValidProviderIdentifiersOutput,
  VpnBearerOutput,
  VpnNodesOutput,
  VpnServicesOutput,
  VpnSitesOutput,
  VpnCarriersOutput,
} from './network-types';
import { VpnService } from './components/forms/service-types';
import { VpnSite } from './components/forms/site-types';
import { VpnBearer, VpnCarrier } from './components/forms/bearer-types';

export type WorkflowPayload = {
  input: unknown;
  name: string;
  version: number;
};
export type WorkflowExecPayload = {
  statusCode: number;
  text: string;
};

export type Callbacks = {
  getVpnServices: () => Promise<VpnServicesOutput>;
  editVpnServices: (body: VpnService) => Promise<unknown>;
  deleteVpnService: (id: string) => Promise<unknown>;
  createVpnService: (body: VpnService) => Promise<void>;
  getVpnSites: () => Promise<VpnSitesOutput>;
  createVpnSite: (body: VpnSite) => Promise<void>;
  editVpnSite: (body: VpnSite) => Promise<void>;
  deleteVpnSite: (id: string) => Promise<void>;
  getValidProviderIdentifiers: () => Promise<ValidProviderIdentifiersOutput>;
  executeWorkflow: (payload: WorkflowPayload) => Promise<WorkflowExecPayload>;
  getWorkflowInstanceDetail: (workflowId: string, options?: RequestInit) => Promise<unknown>;
  getVpnBearers: () => Promise<VpnBearerOutput>;
  createVpnBearer: (bearer: VpnBearer) => Promise<void>;
  editVpnBearer: (bearer: VpnBearer) => Promise<void>;
  deleteVpnBearer: (id: string) => Promise<void>;
  getVpnNodes: () => Promise<VpnNodesOutput>;
  getVpnCarriers: () => Promise<VpnCarriersOutput>;
  createVpnCarrier: (carrier: VpnCarrier) => Promise<void>;
  editVpnCarrier: (carrier: VpnCarrier) => Promise<void>;
  deleteVpnCarrier: (carrierName: string) => Promise<void>;
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
