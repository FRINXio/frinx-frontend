class CallbackUtils {
  constructor() {
    this.getWorkflows = null;
    this.getTaskDefinitions = null;
    this.registerEventListener = null;
    this.putWorkflow = null;
    this.getEventListeners = null;
    this.deleteEventListener = null;
    this.getQueues = null;
    this.deleteWorkflow = null;
    this.deleteTaskDefinition = null;
    this.registerTaskDefinition = null;
    this.getTaskDefinition = null;
    this.getWorkflowExecutions = null;
    this.getWorkflowInstanceDetail = null;
    this.executeWorkflow = null;
    this.getWorkflowExecutionsHierarchical = null;
    this.terminateWorkflows = null;
    this.pauseWorkflows = null;
    this.resumeWorkflows = null;
    this.retryWorkflows = null;
    this.restartWorkflows = null;
    this.deleteWorkflowInstance = null;
    this.getSchedules = null;
    this.deleteSchedule = null;
    this.getSchedule = null;
    this.registerSchedule = null;
  }

  setCallbacks(callbacks) {
    if (this.getWorkflows != null) {
      return;
    }

    this.getWorkflows = callbacks.getWorkflows;

    if (this.getTaskDefinitions != null) {
      return;
    }

    this.getTaskDefinitions = callbacks.getTaskDefinitions;

    if (this.getWorkflow != null) {
      return;
    }

    this.getWorkflow = callbacks.getWorkflow;

    if (this.registerEventListener != null) {
      return;
    }

    this.registerEventListener = callbacks.registerEventListener;

    if (this.putWorkflow != null) {
      return;
    }

    this.putWorkflow = callbacks.putWorkflow;

    if (this.getEventListeners != null) {
      return;
    }

    this.getEventListeners = callbacks.getEventListeners;

    if (this.deleteEventListener != null) {
      return;
    }

    this.deleteEventListener = callbacks.deleteEventListener;

    if (this.getQueues != null) {
      return;
    }

    this.getQueues = callbacks.getQueues;

    if (this.deleteWorkflow != null) {
      return;
    }

    this.deleteWorkflow = callbacks.deleteWorkflow;

    if (this.deleteTaskDefinition != null) {
      return;
    }

    this.deleteTaskDefinition = callbacks.deleteTaskDefinition;

    if (this.registerTaskDefinition != null) {
      return;
    }

    this.registerTaskDefinition = callbacks.registerTaskDefinition;

    if (this.getTaskDefinition != null) {
      return;
    }

    this.getTaskDefinition = callbacks.getTaskDefinition;

    if (this.getWorkflowExecutions != null) {
      return;
    }

    this.getWorkflowExecutions = callbacks.getWorkflowExecutions;

    if (this.getWorkflowInstanceDetail != null) {
      return;
    }

    this.getWorkflowInstanceDetail = callbacks.getWorkflowInstanceDetail;

    if (this.executeWorkflow != null) {
      return;
    }

    this.executeWorkflow = callbacks.executeWorkflow;

    if (this.getWorkflowExecutionsHierarchical != null) {
      return;
    }

    this.getWorkflowExecutionsHierarchical = callbacks.getWorkflowExecutionsHierarchical;

    if (this.terminateWorkflows != null) {
      return;
    }

    this.terminateWorkflows = callbacks.terminateWorkflows;

    if (this.pauseWorkflows != null) {
      return;
    }

    this.pauseWorkflows = callbacks.pauseWorkflows;

    if (this.resumeWorkflows != null) {
      return;
    }

    this.resumeWorkflows = callbacks.resumeWorkflows;

    if (this.retryWorkflows != null) {
      return;
    }

    this.retryWorkflows = callbacks.retryWorkflows;

    if (this.restartWorkflows != null) {
      return;
    }

    this.restartWorkflows = callbacks.restartWorkflows;

    if (this.deleteWorkflowInstance != null) {
      return;
    }

    this.deleteWorkflowInstance = callbacks.deleteWorkflowInstance;

    if (this.getSchedules != null) {
      return;
    }

    this.getSchedules = callbacks.getSchedules;

    if (this.deleteSchedule != null) {
      return;
    }

    this.deleteSchedule = callbacks.deleteSchedule;

    if (this.getSchedule != null) {
      return;
    }

    this.getSchedule = callbacks.getSchedule;

    if (this.registerSchedule != null) {
      return;
    }

    this.registerSchedule = callbacks.registerSchedule;
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

  getEventListenersCallback() {
    if (this.getEventListeners == null) {
      throw new Error('getEventListenersCallback is missing');
    }
    return this.getEventListeners;
  }

  deleteEventListenerCallback() {
    if (this.deleteEventListener == null) {
      throw new Error('deleteEventListenerCallback is missing');
    }
    return this.deleteEventListener;
  }

  getQueuesCallback() {
    if (this.getQueues == null) {
      throw new Error('getQueuesCallback is missing');
    }
    return this.getQueues;
  }

  deleteWorkflowCallback() {
    if (this.deleteWorkflow == null) {
      throw new Error('deleteWorkflowCallback is missing');
    }
    return this.deleteWorkflow;
  }

  deleteTaskDefinitionCallback() {
    if (this.deleteTaskDefinition == null) {
      throw new Error('deleteTaskDefinitionCallback is missing');
    }
    return this.deleteTaskDefinition;
  }

  registerTaskDefinitionCallback() {
    if (this.registerTaskDefinition == null) {
      throw new Error('registerTaskDefinitionCallback is missing');
    }
    return this.registerTaskDefinition;
  }

  getTaskDefinitionCallback() {
    if (this.getTaskDefinition == null) {
      throw new Error('getTaskDefinitionCallback is missing');
    }
    return this.getTaskDefinition;
  }

  getWorkflowExecutionsCallback() {
    if (this.getWorkflowExecutions == null) {
      throw new Error('getWorkflowExecutionsCallback is missing');
    }
    return this.getWorkflowExecutions;
  }

  getWorkflowInstanceDetailCallback() {
    if (this.getWorkflowInstanceDetail == null) {
      throw new Error('getWorkflowInstanceDetailCallback is missing');
    }
    return this.getWorkflowInstanceDetail;
  }

  executeWorkflowCallback() {
    if (this.executeWorkflow == null) {
      throw new Error('executeWorkflowCallback is missing');
    }
    return this.executeWorkflow;
  }

  getWorkflowExecutionsHierarchicalCallback() {
    if (this.getWorkflowExecutionsHierarchical == null) {
      throw new Error('getWorkflowExecutionsHierarchicalCallback is missing');
    }
    return this.getWorkflowExecutionsHierarchical;
  }

  terminateWorkflowsCallback() {
    if (this.terminateWorkflows == null) {
      throw new Error('terminateWorkflowsCallback is missing');
    }
    return this.terminateWorkflows;
  }

  pauseWorkflowsCallback() {
    if (this.pauseWorkflows == null) {
      throw new Error('pauseWorkflowsCallback is missing');
    }
    return this.pauseWorkflows;
  }

  resumeWorkflowsCallback() {
    if (this.resumeWorkflows == null) {
      throw new Error('resumeWorkflowsCallback is missing');
    }
    return this.resumeWorkflows;
  }

  retryWorkflowsCallback() {
    if (this.retryWorkflows == null) {
      throw new Error('retryWorkflowsCallback is missing');
    }
    return this.retryWorkflows;
  }

  restartWorkflowsCallback() {
    if (this.restartWorkflows == null) {
      throw new Error('restartWorkflowsCallback is missing');
    }
    return this.restartWorkflows;
  }

  deleteWorkflowInstanceCallback() {
    if (this.deleteWorkflowInstance == null) {
      throw new Error('deleteWorkflowInstanceCallback is missing');
    }
    return this.deleteWorkflowInstance;
  }

  getSchedulesCallback() {
    if (this.getSchedules == null) {
      throw new Error('getSchedulesCallback is missing');
    }
    return this.getSchedules;
  }

  getScheduleCallback() {
    if (this.getSchedule == null) {
      throw new Error('getScheduleCallback is missing');
    }
    return this.getSchedule;
  }

  deleteScheduleCallback() {
    if (this.deleteSchedule == null) {
      throw new Error('deleteScheduleCallback is missing');
    }
    return this.deleteSchedule;
  }

  registerScheduleCallback() {
    if (this.registerSchedule == null) {
      throw new Error('registerScheduleCallback is missing');
    }
    return this.registerSchedule;
  }
}

export default new CallbackUtils();
