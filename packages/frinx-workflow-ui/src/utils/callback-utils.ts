import { ExecutedWorkflowResponse } from '../pages/executed-workflow-detail/executed-workflow-detail-status.helpers';
import { ScheduledWorkflow, Workflow } from '../helpers/types';
import {
  EventListener,
  Queue,
  TaskDefinition,
  WorkflowExecutionPayload,
  WorkflowExecutionResult,
  WorkflowPayload,
} from '../helpers/uniflow-types';

export type Callbacks = {
  getWorkflows: () => Promise<Workflow[]>;
  getSchedules: () => Promise<ScheduledWorkflow[]>;
  getSchedule: (name: string, version: number) => Promise<ScheduledWorkflow>;
  registerSchedule: (name: string, version: number, schedule: unknown) => Promise<unknown>;
  deleteSchedule: (name: string, version: number) => Promise<unknown>;
  registerTaskDefinition: (taskDefinitions: TaskDefinition[]) => Promise<TaskDefinition[]>;
  getTaskDefinitions: () => Promise<TaskDefinition[]>;
  getTaskDefinition: (name: string) => Promise<TaskDefinition>;
  deleteTaskDefinition: (name: string) => Promise<TaskDefinition>;
  getWorkflow: (name: string, version: number) => Promise<Workflow>;
  deleteWorkflow: (name: string, version: string) => Promise<Workflow>;
  putWorkflow: (workflows: Workflow[]) => Promise<Workflow[]>;
  getEventListeners: () => Promise<EventListener[]>;
  registerEventListener: (eventListener: EventListener) => Promise<EventListener>;
  deleteEventListener: (name: string) => Promise<EventListener>;
  getQueues: () => Promise<Queue[]>;
  getWorkflowExecutions: (payload: WorkflowExecutionPayload) => Promise<WorkflowExecutionResult>;
  getWorkflowExecutionsHierarchical: (payload: WorkflowExecutionPayload) => Promise<WorkflowExecutionResult>;
  getWorkflowInstanceDetail: (workflowId: string, options?: RequestInit) => Promise<ExecutedWorkflowResponse>;
  executeWorkflow: (workflowPayload: WorkflowPayload) => Promise<{ text: string }>;
  terminateWorkflows: (workflowIds: string[]) => Promise<string[]>;
  pauseWorkflows: (workflowIds: string[]) => Promise<string[]>;
  resumeWorkflows: (workflowIds: string[]) => Promise<string[]>;
  retryWorkflows: (workflowIds: string[]) => Promise<string[]>;
  restartWorkflows: (workflowIds: string[]) => Promise<string[]>;
  deleteWorkflowInstance: (workflowId: string) => Promise<string>;
  getExternalStorage: (path: string) => Promise<Record<string, string>>;
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
