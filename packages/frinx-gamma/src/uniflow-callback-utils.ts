export type WorkflowPayload = {
  input: Record<string, string>;
  name: string;
  version: number;
};

export type UniflowCallbacks = {
  executeWorkflow: (workflowPayload: WorkflowPayload) => Promise<{ text: string }>;
  getWorkflowInstanceDetail: (workflowId: string, options?: RequestInit) => Promise<unknown>;
};

class CallbackUtils {
  private callbacks: UniflowCallbacks | null = null;

  setCallbacks(callbacks: UniflowCallbacks) {
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
