import { Workflow, TaskDefinition, Queue, WorkflowPayload, EventListener } from 'helpers/types';
import { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } from './api-helpers';
import { isArrayTypeOf, isEventListener, isQueue, isTaskDefinition, isWorkflow } from './type-guards';

// Get all the workflow definitions
export async function getWorkflows(): Promise<Workflow[]> {
  const workflows: unknown = await sendGetRequest('/metadata/workflow');

  if (isArrayTypeOf<Workflow>(workflows, (w: unknown) => isWorkflow(w))) {
    return workflows
  }

  throw new Error(`Expected Workflow[], got '${typeof workflows}'.`);
}

// Get all the scheduled workflows
export async function getScheduledWorkflows(): Promise<Workflow[]> {
  const scheduled: unknown = await sendGetRequest('/schedule/metadata/workflow');

  if (isArrayTypeOf<Workflow>(scheduled, (s: unknown) => isWorkflow(s))) {
    return scheduled
  }

  throw new Error(`Expected Workflow[], got '${typeof scheduled}'.`);
}

// TODO change route in uniflow-api to "/metadata/taskdefs"
// Register new task definition
export async function registerTaskDefinition(taskDefinition: TaskDefinition): Promise<TaskDefinition> {
  const definition: unknown = await sendPostRequest('/metadata/taskdef/', taskDefinition);

  return definition as TaskDefinition;
}

// Get all the task definitions
export async function getTaskDefinitions(): Promise<TaskDefinition[]> {
  const definitions: unknown = await sendGetRequest('/metadata/taskdefs');

  if (isArrayTypeOf<TaskDefinition>(definitions, (t: unknown) => isTaskDefinition(t))) {
    return definitions
  }

  throw new Error(`Expected TaskDefinitions[], got '${typeof definitions}'.`);
}

// Get a task definition
export async function getTaskDefinition(name: string): Promise<TaskDefinition> {
  const definition: unknown = await sendGetRequest('/metadata/taskdefs/' + name);

  if (isTaskDefinition(definition)) {
    return definition;
  }

  throw new Error(`Expected TaskDefinition, got '${typeof definition}'.`);
}

// Delete a task definition
export async function deleteTaskDefinition(name: string): Promise<TaskDefinition> {
  const query = '?archiveWorfklow=false';
  const definition: unknown = await sendDeleteRequest('/metadata/taskdefs/' + name + query);

  return definition as TaskDefinition;
}

// Returns single workflow based on name and version
export async function getWorkflow(name: string, version: number): Promise<Workflow> {
  const workflow: unknown = await sendGetRequest(`/metadata/workflow/${name}/${version}`);

  if (isWorkflow(workflow)) {
    return workflow;
  }

  throw new Error(`Expected Workflow, got '${typeof workflow}'.`);
}

// Register/Update new workflows
export async function putWorkflow(workflows: Array<Workflow>): Promise<Workflow[]> {
  const workflow: unknown = await sendPutRequest('/metadata/', workflows);

  return workflow as Workflow[];
}

// Get all event listeners
export async function getEventListeners(): Promise<EventListener[]> {
  const eventListeners: unknown = await sendGetRequest('/event');

  if (isArrayTypeOf<EventListener>(eventListeners, (e: unknown) => isEventListener(e))) {
    return eventListeners
  }
  
  throw new Error(`Expected EventListener[], got '${typeof eventListeners}'.`);
}

// Register new event listener
export async function registerEventListener(eventListener: EventListener): Promise<EventListener> {
  const eventListenerRes: unknown = await sendPostRequest('/event', eventListener);

  return eventListenerRes as EventListener;
}

// Delete event listener
export async function deleteEventListener(name: string): Promise<EventListener> {
  const query = '?archiveWorfklow=false';
  const eventListenerRes: unknown = await sendDeleteRequest('/event/' + name + query);

  return eventListenerRes as EventListener;
}

// Get all queues
export async function getQueues(): Promise<Queue[]> {
  const queues: unknown = await sendGetRequest('/queue/data');

  if (isArrayTypeOf<Queue>(queues, (q: unknown) => isQueue(q))) {
    return queues
  }

  throw new Error(`Expected Queue[], got '${typeof queues}'.`);
}

// TODO: Just copy-pasted for now, needs rework in uniflow-api
// Returns hierarchical list of running workflows
export async function getWorkflowExecutions(query: string): Promise<unknown> {
  query = 'status:"RUNNING"';
  const executions: unknown = sendGetRequest(`/executions/?q=&h=&freeText=${query}&start=0&size=`);

  return executions;
}

// TODO: needs rework in uniflow-api
// Get detail of existing instance of workflow
export async function getWorkflowInstanceDetail(workflowId: number): Promise<unknown> {
  const workflowDetails: unknown = sendGetRequest('/id/' + workflowId);

  return workflowDetails;
}

// Execute workflow based on payload
export async function executeWorkflow(workflowPayload: WorkflowPayload): Promise<WorkflowPayload> {
  const payload: unknown = await sendPostRequest('/workflow', workflowPayload);

  return payload as WorkflowPayload;
}

// Returns workflowIds of deleted workflow
export async function terminateWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes: unknown = await sendDeleteRequest('/bulk/terminate', workflowIds);

  return workflowIdsRes as string[];
}

export async function pauseWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes: unknown = await sendPutRequest('/bulk/pause', workflowIds);

  return workflowIdsRes as string[];
}

export async function resumeWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes: unknown = await sendPutRequest('/bulk/resume', workflowIds);

  return workflowIdsRes as string[];
}

export async function retryWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes: unknown = await sendPostRequest('/bulk/retry', workflowIds);

  return workflowIdsRes as string[];
}

export async function restartWorkflows(workflowIds: string[]): Promise<string[]> {
  const workflowIdsRes: unknown = await sendPostRequest('/bulk/restart', workflowIds);

  return workflowIdsRes as string[];
}
