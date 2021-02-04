// TODO types for callbacks

class CallbackUtils {
  getWorkflows: unknown | null;
  getWorkflow: unknown | null;
  getTaskDefinitions: unknown | null;
  registerEventListener: unknown | null;
  putWorkflow: unknown | null;

  constructor() {
    this.getWorkflows = null;
    this.getTaskDefinitions = null;
    this.registerEventListener = null;
    this.putWorkflow = null;
  }

  setCallbacks(callbacks: {
    getWorkflows: unknown;
    getWorkflow: unknown;
    getTaskDefinitions: unknown;
    registerEventListener: unknown;
    putWorkflow: unknown;
  }) {
    console.log(callbacks.getWorkflows, callbacks.getTaskDefinitions);
    if (this.getWorkflows != null) {
      throw new Error('getWorkflowsCallback is already set');
    }

    this.getWorkflows = callbacks.getWorkflows;

    if (this.getTaskDefinitions != null) {
      throw new Error('getTaskDefinitionsCallback is already set');
    }

    this.getTaskDefinitions = callbacks.getTaskDefinitions;

    if (this.getWorkflow != null) {
      throw new Error('getWorkflow is already set');
    }

    this.getWorkflow = callbacks.getWorkflow;

    if (this.registerEventListener != null) {
      throw new Error('registerEventListener is already set');
    }

    this.registerEventListener = callbacks.registerEventListener;

    if (this.putWorkflow != null) {
      throw new Error('putWorkflow is already set');
    }

    this.putWorkflow = callbacks.putWorkflow;
  }

  getWorkflowsCallback() {
    if (this.getWorkflows == null) {
      throw new Error('getWorkflowsCallback is missing');
    }
    return this.getWorkflows;
  }

  getWorkflowCallback() {
    if (this.getWorkflow == null) {
      throw new Error('getWorkflowCallback is missing');
    }
    return this.getWorkflow;
  }

  getTaskDefinitionsCallback() {
    if (this.getTaskDefinitions == null) {
      throw new Error('getTaskDefinitionsCallback is missing');
    }
    return this.getTaskDefinitions;
  }

  registerEventListenerCallback() {
    if (this.registerEventListener == null) {
      throw new Error('registerEventListenerCallback is missing');
    }
    return this.registerEventListener;
  }

  putWorkflowCallback() {
    if (this.putWorkflow == null) {
      throw new Error('putWorkflowCallback is missing');
    }
    return this.putWorkflow;
  }
}

export default new CallbackUtils();
