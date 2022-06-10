import { ExecutedWorkflowResponse, TaskDefinition, Workflow, WorkflowExecutionPayload } from './helpers/types';

export type Callbacks = {
  getWorkflows: () => Promise<Workflow[]>;
  getTaskDefinitions: () => Promise<TaskDefinition[]>;
  getWorkflow: (name: string, version: number) => Promise<Workflow>;
  deleteWorkflow: (name: string, version: string) => Promise<Workflow>;
  putWorkflow: (workflows: Workflow[]) => Promise<Workflow[]>;
  getWorkflowExecutions: (payload: WorkflowExecutionPayload) => Promise<ExecutedWorkflowResponse>;
  getWorkflowInstanceDetail: (workflowId: string, options?: RequestInit) => Promise<ExecutedWorkflowResponse>;
  executeWorkflow: (workflowPayload: WorkflowPayload) => Promise<{ text: string }>;
};

type WorkflowPayload = {
  input: unknown;
  name: string;
  version: number;
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
