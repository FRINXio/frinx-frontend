// TODO types for callbacks

class CallbackUtils {
  getWorkflows: unknown | null;
  getTaskDefinitions: unknown | null;

  constructor() {
    this.getWorkflows = null;
    this.getTaskDefinitions = null;
  }

  setCallbacks(callbacks: { getWorkflows: unknown; getTaskDefinitions: unknown }) {
    console.log(callbacks.getWorkflows, callbacks.getTaskDefinitions);
    if (this.getWorkflows != null) {
      throw new Error('getWorkflowsCallback is already set');
    }

    this.getWorkflows = callbacks.getWorkflows;

    if (this.getTaskDefinitions != null) {
      throw new Error('getTaskDefinitionsCallback is already set');
    }

    this.getTaskDefinitions = callbacks.getTaskDefinitions;
  }

  async getWorkflowsCallback() {
    if (this.getWorkflows == null) {
      throw new Error('getWorkflowsCallback is missing');
    }
    return this.getWorkflows;
  }

  getTaskDefinitionsCallback() {
    if (this.getTaskDefinitions == null) {
      throw new Error('getTaskDefinitionsCallback is missing');
    }
    return this.getTaskDefinitions;
  }
}

export default new CallbackUtils();
