import { ValidProviderIdentifiersOutput, VpnBearerOutput, VpnServicesOutput, VpnSitesOutput } from './network-types';
import { VpnService } from './components/forms/service-types';
import { VpnSite } from './components/forms/site-types';

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
