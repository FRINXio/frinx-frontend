import { TaskDefinition, Workflow } from './helpers/types';
import unwrap from './helpers/unwrap';

export type Callbacks = {
  putWorkflow: (workflows: Workflow[]) => Promise<unknown>;
  getWorkflow: (name: string, version: string) => Promise<Workflow>;
  getWorkflows: () => Promise<Workflow[]>;
  getTaskDefinitions: () => Promise<TaskDefinition[]>;
  getWorkflowExecutions: (query?: string, start?: number, size?: string) => Promise<unknown>;
  getWorkflowInstanceDetail: (workflowId: number) => Promise<unknown>;
  executeWorkflow: (payload: WorkflowPayload) => Promise<unknown>;
  deleteWorkflow: (name: string, version: string) => Promise<unknown>;
};

type WorkflowPayload = {
  input: unknown;
  name: string;
  version: number;
};

class CallbackUtils {
  private getWorkflow: ((name: string, version: string) => Promise<Workflow>) | null = null;

  private getWorkflows: (() => Promise<Workflow[]>) | null = null;

  private getTaskDefinitions: (() => Promise<TaskDefinition[]>) | null = null;

  private saveWorkflow: ((workflows: Workflow[]) => Promise<unknown>) | null = null;

  private getWorkflowExecutions: ((query?: string, start?: number, size?: string) => Promise<unknown>) | null = null;

  private getWorkflowInstanceDetail: ((workflowId: number) => Promise<unknown>) | null = null;

  private executeWorkflow: ((payload: WorkflowPayload) => Promise<unknown>) | null = null;

  private deleteWorkflow: ((name: string, version: string) => Promise<unknown>) | null = null;

  setCallbacks = (callbacks: Callbacks) => {
    if (this.getWorkflow == null) {
      this.getWorkflow = callbacks.getWorkflow;
    }

    if (this.getWorkflows == null) {
      this.getWorkflows = callbacks.getWorkflows;
    }

    if (this.getTaskDefinitions == null) {
      this.getTaskDefinitions = callbacks.getTaskDefinitions;
    }

    if (this.saveWorkflow == null) {
      this.saveWorkflow = callbacks.putWorkflow;
    }

    if (this.getWorkflowExecutions == null) {
      this.getWorkflowExecutions = callbacks.getWorkflowExecutions;
    }

    if (this.getWorkflowInstanceDetail == null) {
      this.getWorkflowInstanceDetail = callbacks.getWorkflowInstanceDetail;
    }

    if (this.executeWorkflow == null) {
      this.executeWorkflow = callbacks.executeWorkflow;
    }

    if (this.deleteWorkflow == null) {
      this.deleteWorkflow = callbacks.deleteWorkflow;
    }
  };

  getWorkflowCallback = () => unwrap(this.getWorkflow);

  getWorkflowsCallback = () => unwrap(this.getWorkflows);

  getTaskDefinitionsCallback = () => unwrap(this.getTaskDefinitions);

  saveWorkflowCallback = () => unwrap(this.saveWorkflow);

  getWorkflowExecutionsCallback = () => unwrap(this.getWorkflowExecutions);

  getWorkflowInstanceDetailCallback = () => unwrap(this.getWorkflowInstanceDetail);

  executeWorkflowCallback = () => unwrap(this.executeWorkflow);

  deleteWorkflowCallback = () => unwrap(this.deleteWorkflow);
}

export default new CallbackUtils();
