import { ExecutedWorkflowResponse } from '../pages/executed-workflow-detail/executed-workflow-detail-status.helpers';
import {
  ExecutedWorkflowsFlat,
  ExecutedWorkflowsHierarchical,
  ExtendedTask,
  ScheduledWorkflow,
  Workflow,
  WorkflowInstanceDetail,
} from '../types/types';
import { EventListener, Queue, TaskDefinition, WorkflowPayload } from '../types/uniflow-types';

export type Callbacks = {
  getWorkflows: () => Promise<Workflow[]>;
  getWorkflow: (name: string, version: string) => Promise<Workflow>;
  getSchedule: (name: string, version: string) => Promise<ScheduledWorkflow>;
  getTaskDefinitions: () => Promise<TaskDefinition[]>;
  getTaskDefinition: (name: string) => Promise<TaskDefinition>;
  registerEventListener: (eventListener: EventListener) => Promise<EventListener>;
  putWorkflow: (workflows: Workflow[]) => Promise<Workflow[]>;
  getEventListeners: () => Promise<EventListener[]>;
  deleteEventListener: (name: string) => Promise<EventListener>;
  getQueues: () => Promise<Queue>;
  deleteWorkflow: (name: string, version: string) => Promise<Workflow>;
  deleteTaskDefinition: (name: string) => Promise<TaskDefinition>;
  registerTaskDefinition: (taskDefinition: TaskDefinition) => Promise<TaskDefinition>;
  getWorkflowExecutions: (
    workflowId: string,
    label: string,
    start: number,
    size: string,
  ) => Promise<ExecutedWorkflowsFlat>;
  getWorkflowInstanceDetail: (workflowId: string, options?: RequestInit) => Promise<ExecutedWorkflowResponse>;
  executeWorkflow: (workflowPayload: WorkflowPayload) => Promise<WorkflowPayload>;
  getWorkflowExecutionsHierarchical: (
    query: string,
    label: string,
    start?: number,
    size?: string,
  ) => Promise<ExecutedWorkflowsHierarchical>;
  terminateWorkflows: (workflowIds: string[]) => Promise<string[]>;
  pauseWorkflows: (workflowIds: string[]) => Promise<string[]>;
  resumeWorkflows: (workflowIds: string[]) => Promise<string[]>;
  retryWorkflows: (workflowIds: string[]) => Promise<string[]>;
  restartWorkflows: (workflowIds: string[]) => Promise<{ text: string; statusCode: number }>;
  deleteWorkflowInstance: (workflowId: string) => Promise<string>;
  getSchedules: () => Promise<ScheduledWorkflow[]>;
  deleteSchedule: (name: string, version: string) => Promise<unknown>;
  registerSchedule: (
    name: string,
    version: string,
    schedule: Partial<ScheduledWorkflow>,
  ) => Promise<{ message: string }>;
  getExternalStorage: (path: string) => Promise<Record<string, string>>;
};

class CallbackUtils {
  private getWorkflows: (() => Promise<Workflow[]>) | null = null;
  private getWorkflow: ((name: string, version: string) => Promise<Workflow>) | null = null;
  private getSchedule: ((name: string, version: string) => Promise<ScheduledWorkflow>) | null = null;
  private getTaskDefinitions: (() => Promise<TaskDefinition[]>) | null = null;
  private getTaskDefinition: ((name: string) => Promise<TaskDefinition>) | null = null;
  private registerEventListener: ((eventListener: EventListener) => Promise<EventListener>) | null = null;
  private putWorkflow: ((workflows: Workflow[]) => Promise<Workflow[]>) | null = null;
  private getEventListeners: (() => Promise<EventListener[]>) | null = null;
  private deleteEventListener: ((name: string) => Promise<EventListener>) | null = null;
  private getQueues: (() => Promise<Queue>) | null = null;
  private deleteWorkflow: ((name: string, version: string) => Promise<Workflow>) | null = null;
  private deleteTaskDefinition: ((name: string) => Promise<TaskDefinition>) | null = null;
  private registerTaskDefinition: ((taskDefinition: TaskDefinition) => Promise<TaskDefinition>) | null = null;
  private getWorkflowExecutions:
    | ((workflowId: string, label: string, start: number, size: string) => Promise<ExecutedWorkflowsFlat>)
    | null = null;
  private getWorkflowInstanceDetail:
    | ((workflowId: string, options?: RequestInit) => Promise<ExecutedWorkflowResponse>)
    | null = null;
  private executeWorkflow: ((workflowPayload: WorkflowPayload) => Promise<WorkflowPayload>) | null = null;
  private getWorkflowExecutionsHierarchical:
    | ((query: string, label: string, start?: number, size?: string) => Promise<ExecutedWorkflowsHierarchical>)
    | null = null;
  private terminateWorkflows: ((workflowIds: string[]) => Promise<string[]>) | null = null;
  private pauseWorkflows: ((workflowIds: string[]) => Promise<string[]>) | null = null;
  private resumeWorkflows: ((workflowIds: string[]) => Promise<string[]>) | null = null;
  private retryWorkflows: ((workflowIds: string[]) => Promise<string[]>) | null = null;
  private restartWorkflows: ((workflowIds: string[]) => Promise<{ text: string; statusCode: number }>) | null = null;
  private deleteWorkflowInstance: ((workflowId: string) => Promise<string>) | null = null;
  private getSchedules: (() => Promise<ScheduledWorkflow[]>) | null = null;
  private deleteSchedule: ((name: string, version: string) => Promise<unknown>) | null = null;
  private registerSchedule:
    | ((name: string, version: string, schedule: Partial<ScheduledWorkflow>) => Promise<{ message: string }>)
    | null = null;
  private getExternalStorage: (path: string) => Promise<Record<string, string>>;

  setCallbacks(callbacks: Callbacks) {
    if (this.getWorkflows == null) {
      this.getWorkflows = callbacks.getWorkflows;
    }

    if (this.getTaskDefinitions == null) {
      this.getTaskDefinitions = callbacks.getTaskDefinitions;
    }

    if (this.getWorkflow == null) {
      this.getWorkflow = callbacks.getWorkflow;
    }

    if (this.registerEventListener == null) {
      this.registerEventListener = callbacks.registerEventListener;
    }

    if (this.putWorkflow == null) {
      this.putWorkflow = callbacks.putWorkflow;
    }

    if (this.getEventListeners == null) {
      this.getEventListeners = callbacks.getEventListeners;
    }

    if (this.deleteEventListener == null) {
      this.deleteEventListener = callbacks.deleteEventListener;
    }

    if (this.getQueues == null) {
      this.getQueues = callbacks.getQueues;
    }

    if (this.deleteWorkflow == null) {
      this.deleteWorkflow = callbacks.deleteWorkflow;
    }

    if (this.deleteTaskDefinition == null) {
      this.deleteTaskDefinition = callbacks.deleteTaskDefinition;
    }

    if (this.registerTaskDefinition == null) {
      this.registerTaskDefinition = callbacks.registerTaskDefinition;
    }

    if (this.getTaskDefinition == null) {
      this.getTaskDefinition = callbacks.getTaskDefinition;
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

    if (this.getWorkflowExecutionsHierarchical == null) {
      this.getWorkflowExecutionsHierarchical = callbacks.getWorkflowExecutionsHierarchical;
    }

    if (this.terminateWorkflows == null) {
      this.terminateWorkflows = callbacks.terminateWorkflows;
    }

    if (this.pauseWorkflows == null) {
      this.pauseWorkflows = callbacks.pauseWorkflows;
    }

    if (this.resumeWorkflows == null) {
      this.resumeWorkflows = callbacks.resumeWorkflows;
    }

    if (this.retryWorkflows == null) {
      this.retryWorkflows = callbacks.retryWorkflows;
    }

    if (this.restartWorkflows == null) {
      this.restartWorkflows = callbacks.restartWorkflows;
    }

    if (this.deleteWorkflowInstance == null) {
      this.deleteWorkflowInstance = callbacks.deleteWorkflowInstance;
    }

    if (this.getSchedules == null) {
      this.getSchedules = callbacks.getSchedules;
    }

    if (this.deleteSchedule == null) {
      this.deleteSchedule = callbacks.deleteSchedule;
    }

    if (this.getSchedule == null) {
      this.getSchedule = callbacks.getSchedule;
    }

    if (this.registerSchedule == null) {
      this.registerSchedule = callbacks.registerSchedule;
    }
    if (this.getExternalStorage == null) {
      this.getExternalStorage = callbacks.getExternalStorage;
    }
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

  getExternalStorageCallback() {
    if (this.getExternalStorage == null) {
      throw new Error('getExternalStorage is missing');
    }
    return this.getExternalStorage;
  }
}

export default new CallbackUtils();
