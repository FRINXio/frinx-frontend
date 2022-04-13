import {
  Workflow,
  TaskDefinition,
  Queue,
  WorkflowPayload,
  EventListener,
  ExecutedWorkflowResponse,
  ScheduledWorkflow,
} from './types';
import { isArrayTypeOf, isEventListener, isQueue, isTaskDefinition, isWorkflow } from './type-guards';
import { ApiHelpers } from '../api-helpers';

export type UniflowApiClient = {
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
  getWorkflowExecutions: (workflowId: string, label: string, start: number, size: string) => Promise<unknown>;
  getWorkflowExecutionsHierarchical: (query: string, label: string, start?: number, size?: string) => Promise<unknown>;
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

export default function createUniflowApiClient(apiHelpers: ApiHelpers): UniflowApiClient {
  const { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } = apiHelpers;
  // Get all the workflow definitions (including scheduled)
  async function getWorkflows(): Promise<Workflow[]> {
    const response = await sendGetRequest('/metadata/workflow');
    // TODO: backend should return just 'Workflow[]' not '{result: Workflow[]}`
    const workflows = (response as { result: unknown }).result;

    if (isArrayTypeOf<Workflow>(workflows, isWorkflow)) {
      return workflows;
    }

    throw new Error(`Expected Workflow[], got '${JSON.stringify(workflows)}'.`);
  }

  // TODO: types, guards
  // Get schedules of workflows
  async function getSchedules(): Promise<ScheduledWorkflow[]> {
    const scheduled = await sendGetRequest('/schedule');

    return scheduled as ScheduledWorkflow[];
  }

  // TODO: types, guards
  // Get workflow schedule
  async function getSchedule(name: string, version: number): Promise<ScheduledWorkflow> {
    const scheduled = await sendGetRequest(`/schedule/${name}:${version}`);

    return scheduled as ScheduledWorkflow;
  }

  // TODO: types, guards
  // Register workflow schedule
  async function registerSchedule(name: string, version: number, schedule: unknown): Promise<unknown> {
    return sendPutRequest(`/schedule/${name}:${version}`, schedule);
  }

  // TODO: types, guards
  // Delete workflow schedule
  async function deleteSchedule(name: string, version: number): Promise<unknown> {
    const scheduled = await sendDeleteRequest(`/schedule/${name}:${version}`);

    return scheduled;
  }

  // Register new task definition
  async function registerTaskDefinition(taskDefinition: TaskDefinition[]): Promise<TaskDefinition[]> {
    const definition = await sendPostRequest('/metadata/taskdefs/', taskDefinition);

    return definition as TaskDefinition[];
  }

  // Get all the task definitions
  async function getTaskDefinitions(): Promise<TaskDefinition[]> {
    const response = await sendGetRequest('/metadata/taskdefs');
    // TODO: backend should return just 'Workflow[]' not '{result: Workflow[]}`
    const definitions = (response as { result: unknown }).result;

    if (isArrayTypeOf<TaskDefinition>(definitions, isTaskDefinition)) {
      return definitions;
    }

    throw new Error(`Expected TaskDefinitions[], got '${JSON.stringify(definitions)}'.`);
  }

  // Get a task definition
  async function getTaskDefinition(name: string): Promise<TaskDefinition> {
    const response = await sendGetRequest(`/metadata/taskdefs/${name}`);
    const definition = (response as { result: unknown }).result;

    if (isTaskDefinition(definition)) {
      return definition;
    }

    throw new Error(`Expected TaskDefinition, got '${JSON.stringify(definition)}'.`);
  }

  // Delete a task definition
  async function deleteTaskDefinition(name: string): Promise<TaskDefinition> {
    const query = '?archiveWorfklow=false';
    const definition = await sendDeleteRequest(`/metadata/taskdefs/${name}${query}`);

    return definition as TaskDefinition;
  }

  // Returns single workflow based on name and version
  async function getWorkflow(name: string, version: number): Promise<Workflow> {
    const response = await sendGetRequest(`/metadata/workflow/${name}?version=${version}`);
    // TODO: backend should return just 'Workflow' not '{result: Workflow}`
    const workflow = (response as { result: unknown }).result;

    if (isWorkflow(workflow)) {
      return workflow;
    }

    throw new Error(`Expected Workflow, got '${JSON.stringify(workflow)}'.`);
  }

  // Delete workflow
  async function deleteWorkflow(name: string, version: string): Promise<Workflow> {
    const workflow = await sendDeleteRequest(`/metadata/workflow/${name}/${version}`);

    return workflow as Workflow;
  }

  // Register/Update new workflows
  async function putWorkflow(workflows: Workflow[]): Promise<Workflow[]> {
    const workflow = await sendPutRequest('/metadata/workflow', workflows);

    return workflow as Workflow[];
  }

  // Get all event listeners
  async function getEventListeners(): Promise<EventListener[]> {
    const eventListeners = await sendGetRequest('/event');

    if (isArrayTypeOf<EventListener>(eventListeners, isEventListener)) {
      return eventListeners;
    }

    throw new Error(`Expected EventListener[], got '${JSON.stringify(eventListeners)}'.`);
  }

  // Register new event listener
  async function registerEventListener(eventListener: EventListener): Promise<EventListener> {
    const eventListenerRes = await sendPostRequest('/event', eventListener);

    return eventListenerRes as EventListener;
  }

  // Delete event listener
  async function deleteEventListener(name: string): Promise<EventListener> {
    const query = '?archiveWorfklow=false';
    const eventListenerRes = await sendDeleteRequest(`/event/${name}${query}`);

    return eventListenerRes as EventListener;
  }

  // Get all queues
  async function getQueues(): Promise<Queue[]> {
    const response = await sendGetRequest('/queue/data');
    const queues = (response as { polldata: unknown }).polldata;

    if (isArrayTypeOf<Queue>(queues, isQueue)) {
      return queues;
    }

    throw new Error(`Expected Queue[], got '${JSON.stringify(queues)}'.`);
  }

  // TODO: Just copy-pasted for now, needs rework in uniflow-api
  // Returns list of running workflows
  async function getWorkflowExecutions(workflowId = '*', label = '"RUNNING"', start = 0, size = ''): Promise<unknown> {
    const executions = sendGetRequest(
      `/executions/?workflowId=${workflowId}&status=${label}&start=${start}&size=${size}`,
    );

    return executions;
  }

  // TODO: Just copy-pasted for now, needs rework in uniflow-api
  // Returns list of running workflows in hierarchical strucutre
  async function getWorkflowExecutionsHierarchical(
    query: string,
    label: string,
    start?: number,
    size?: string,
  ): Promise<unknown> {
    const executions = sendGetRequest(`/hierarchical/?workflowId=${query}&status=${label}&start=${start}&size=${size}`);

    return executions;
  }

  // TODO: needs rework in uniflow-api
  // Get detail of existing instance of workflow
  async function getWorkflowInstanceDetail(
    workflowId: string,
    options?: RequestInit,
  ): Promise<ExecutedWorkflowResponse> {
    const workflowDetails = await sendGetRequest(`/id/${workflowId}`, options);

    return workflowDetails as ExecutedWorkflowResponse;
  }

  // Execute workflow based on payload
  async function executeWorkflow(workflowPayload: WorkflowPayload): Promise<{ text: string }> {
    const payload = await sendPostRequest('/workflow', workflowPayload);

    return payload as { text: string };
  }

  // Returns workflowIds of deleted workflow
  async function terminateWorkflows(workflowIds: string[]): Promise<string[]> {
    const workflowIdsRes = await sendPostRequest('/workflow/bulk/terminate', workflowIds);

    return workflowIdsRes as string[];
  }

  async function pauseWorkflows(workflowIds: string[]): Promise<string[]> {
    const workflowIdsRes = await sendPutRequest('/workflow/bulk/pause', workflowIds);

    return workflowIdsRes as string[];
  }

  async function resumeWorkflows(workflowIds: string[]): Promise<string[]> {
    const workflowIdsRes = await sendPutRequest('/workflow/bulk/resume', workflowIds);

    return workflowIdsRes as string[];
  }

  async function retryWorkflows(workflowIds: string[]): Promise<string[]> {
    const workflowIdsRes = await sendPostRequest('/workflow/bulk/retry', workflowIds);

    return workflowIdsRes as string[];
  }

  async function restartWorkflows(workflowIds: string[]): Promise<string[]> {
    const workflowIdsRes = await sendPostRequest('/workflow/bulk/restart', workflowIds);

    return workflowIdsRes as string[];
  }

  async function deleteWorkflowInstance(workflowId: string): Promise<string> {
    const workflowIdRes = await sendDeleteRequest(`/workflow/${workflowId}`);

    return workflowIdRes as string;
  }

  async function getExternalStorage(path: string): Promise<Record<string, string>> {
    const data = await sendGetRequest(`/external/postgres/${path}`);
    return data as Record<string, string>;
  }

  return {
    getWorkflows,
    getSchedules,
    getSchedule,
    registerSchedule,
    deleteSchedule,
    registerTaskDefinition,
    getTaskDefinitions,
    getTaskDefinition,
    deleteTaskDefinition,
    getWorkflow,
    deleteWorkflow,
    putWorkflow,
    getEventListeners,
    registerEventListener,
    deleteEventListener,
    getQueues,
    getWorkflowExecutions,
    getWorkflowExecutionsHierarchical,
    getWorkflowInstanceDetail,
    executeWorkflow,
    terminateWorkflows,
    pauseWorkflows,
    resumeWorkflows,
    retryWorkflows,
    restartWorkflows,
    deleteWorkflowInstance,
    getExternalStorage,
  };
}
