import { Workflow, TaskDefinition, Queue, WorkflowPayload, EventListener } from '../../helpers/types/uniflow-types';
import { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } from './api-helpers';
import {
  isArrayTypeOf,
  isEventListener,
  isQueue,
  isTaskDefinition,
  isWorkflow,
} from '../../helpers/types/uniflow-type-guards';

// Get all the workflow definitions (including scheduled)
export async function getWorkflows(): Promise<Workflow[]> {
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
export async function getSchedules(): Promise<unknown> {
  const scheduled = await sendGetRequest('/schedule/');

  return scheduled;
}

// TODO: types, guards
// Get workflow schedule
export async function getSchedule(name: string): Promise<unknown> {
  const scheduled = await sendGetRequest(`/schedule/${name}`);

  return scheduled;
}

// TODO: types, guards
// Register workflow schedule
export async function registerSchedule(name: string, schedule: unknown): Promise<unknown> {
  const scheduled = await sendPutRequest(`/schedule/${name}`, schedule);

  return scheduled;
}

// TODO: types, guards
// Delete workflow schedule
export async function deleteSchedule(name: string): Promise<unknown> {
  const scheduled = await sendDeleteRequest(`/schedule/${name}`);

  return scheduled;
}

// Register new task definition
export async function registerTaskDefinition(taskDefinition: TaskDefinition[]): Promise<TaskDefinition[]> {
  const definition = await sendPostRequest('/metadata/taskdefs/', taskDefinition);

  return definition as TaskDefinition[];
}

// Get all the task definitions
export async function getTaskDefinitions(): Promise<TaskDefinition[]> {
  const response = await sendGetRequest('/metadata/taskdefs');
  // TODO: backend should return just 'Workflow[]' not '{result: Workflow[]}`
  const definitions = (response as { result: unknown }).result;

  if (isArrayTypeOf<TaskDefinition>(definitions, isTaskDefinition)) {
    return definitions;
  }

  throw new Error(`Expected TaskDefinitions[], got '${JSON.stringify(definitions)}'.`);
}

// Get a task definition
export async function getTaskDefinition(name: string): Promise<TaskDefinition> {
  const response = await sendGetRequest(`/metadata/taskdefs/${name}`);
  const definition = (response as { result: unknown }).result;

  if (isTaskDefinition(definition)) {
    return definition;
  }

  throw new Error(`Expected TaskDefinition, got '${JSON.stringify(definition)}'.`);
}

// Delete a task definition
export async function deleteTaskDefinition(name: string): Promise<TaskDefinition> {
  const query = '?archiveWorfklow=false';
  const definition = await sendDeleteRequest(`/metadata/taskdef/${name}${query}`);

  return definition as TaskDefinition;
}

// Returns single workflow based on name and version
export async function getWorkflow(name: string, version: string): Promise<Workflow> {
  const response = await sendGetRequest(`/metadata/workflow/${name}/${version}`);
  // TODO: backend should return just 'Workflow' not '{result: Workflow}`
  const workflow = (response as { result: unknown }).result;

  if (isWorkflow(workflow)) {
    return workflow;
  }

  throw new Error(`Expected Workflow, got '${JSON.stringify(workflow)}'.`);
}

// Delete workflow
export async function deleteWorkflow(name: string, version: string): Promise<Workflow> {
  const workflow = await sendDeleteRequest(`/metadata/workflow/${name}/${version}`);

  return workflow as Workflow;
}

// Register/Update new workflows
export async function putWorkflow(workflows: Workflow[]): Promise<Workflow[]> {
  const workflow = await sendPutRequest('/metadata/', workflows);

  return workflow as Workflow[];
}

// Get all event listeners
export async function getEventListeners(): Promise<EventListener[]> {
  const eventListeners = await sendGetRequest('/event');

  if (isArrayTypeOf<EventListener>(eventListeners, isEventListener)) {
    return eventListeners;
  }

  throw new Error(`Expected EventListener[], got '${JSON.stringify(eventListeners)}'.`);
}

// Register new event listener
export async function registerEventListener(eventListener: EventListener): Promise<EventListener> {
  const eventListenerRes = await sendPostRequest('/event', eventListener);

  return eventListenerRes as EventListener;
}

// Delete event listener
export async function deleteEventListener(name: string): Promise<EventListener> {
  const query = '?archiveWorfklow=false';
  const eventListenerRes = await sendDeleteRequest(`/event/${name}${query}`);

  return eventListenerRes as EventListener;
}

// Get all queues
export async function getQueues(): Promise<Queue[]> {
  const response = await sendGetRequest('/queue/data');
  const queues = (response as { polldata: unknown }).polldata;

  if (isArrayTypeOf<Queue>(queues, isQueue)) {
    return queues;
  }

  throw new Error(`Expected Queue[], got '${JSON.stringify(queues)}'.`);
}

// TODO: Just copy-pasted for now, needs rework in uniflow-api
// Returns list of running workflows
export async function getWorkflowExecutions(query = 'status:"RUNNING"', start = 0, size = ''): Promise<unknown> {
  const executions = sendGetRequest(`/executions/?q=&h=&freeText=${query}&start=${start}&size=${size}`);

  return executions;
}

// TODO: Just copy-pasted for now, needs rework in uniflow-api
// Returns list of running workflows in hierarchical strucutre
export async function getWorkflowExecutionsHierarchical(
  query: string,
  start?: number,
  size?: string,
): Promise<unknown> {
  const executions = sendGetRequest(`/hierarchical/?freeText=${query}&start=${start}&size=${size}`);

  return executions;
}

// TODO: needs rework in uniflow-api
// Get detail of existing instance of workflow
export async function getWorkflowInstanceDetail(workflowId: number): Promise<unknown> {
  const workflowDetails = sendGetRequest(`/id/${workflowId}`);

  return workflowDetails;
}

// Execute workflow based on payload
export async function executeWorkflow(workflowPayload: WorkflowPayload): Promise<WorkflowPayload> {
  const payload = await sendPostRequest('/workflow', workflowPayload);

  return payload as WorkflowPayload;
}

// Returns workflowIds of deleted workflow
export async function terminateWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes = await sendDeleteRequest('/bulk/terminate', workflowIds);

  return workflowIdsRes as string[];
}

export async function pauseWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes = await sendPutRequest('/bulk/pause', workflowIds);

  return workflowIdsRes as string[];
}

export async function resumeWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes = await sendPutRequest('/bulk/resume', workflowIds);

  return workflowIdsRes as string[];
}

export async function retryWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes = await sendPostRequest('/bulk/retry', workflowIds);

  return workflowIdsRes as string[];
}

export async function restartWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes = await sendPostRequest('/bulk/restart', workflowIds);

  return workflowIdsRes as string[];
}

export async function deleteWorkflowInstance(workflowId: string): Promise<string> {
  const workflowIdRes = await sendDeleteRequest(`/workflow/${workflowId}`);

  return workflowIdRes as string;
}
