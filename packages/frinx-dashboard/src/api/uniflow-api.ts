import { Workflow, TaskDefinition, Queue, WorkflowPayload } from 'helpers/types';
import { get, post, put, del, HttpResponse } from './api-helpers';

// TODO dynamic source of url
const CONDUCTOR_API_URL: string = 'localhost:8080/api';

// Get all the workflow definitions
export function getWorkflows(): Promise<HttpResponse<Workflow>> {
  return get<Workflow>(CONDUCTOR_API_URL + '/metadata/workflow');
}

// Get all the scheduled workflows
export function getScheduledWorkflows(): Promise<HttpResponse<Workflow>> {
  return get<Workflow>(CONDUCTOR_API_URL + '/schedule/metadata/workflow');
}

// TODO change route in uniflow-api to "/metadata/taskdefs"
// Register new task definition
export function registerTaskDefinition(taskDefinition: TaskDefinition): Promise<HttpResponse<any>> {
  return post(CONDUCTOR_API_URL + '/metadata/taskdef/', taskDefinition);
}

// Get all the task definitions
export function getTaskDefinition(name: string): Promise<HttpResponse<TaskDefinition>> {
  return get<TaskDefinition>(CONDUCTOR_API_URL + '/metadata/taskdefs/' + name);
}

// Delete a task definition
export function deleteTaskDefinition(name: string): Promise<HttpResponse<any>> {
  const query = '?archiveWorfklow=false';
  return del(CONDUCTOR_API_URL + '/metadata/taskdefs/' + name + query);
}

// Returns single workflow based on name and version
export function getWorkflow(name: string, version: number): Promise<HttpResponse<Workflow>> {
  return get<Workflow>(CONDUCTOR_API_URL + `/metadata/workflow/${name}/${version}`);
}

// Register/Update new workflows
export function putWorkflow(workflows: Array<Workflow>): Promise<HttpResponse<Workflow>> {
  return put<Workflow>(CONDUCTOR_API_URL + '/metadata/', workflows);
}

// Get all event listeners
export function getEventListeners(): Promise<HttpResponse<EventListener>> {
  return get<EventListener>(CONDUCTOR_API_URL + '/event');
}

// Register new event listener
export function registerEventListener(eventListener: EventListener): Promise<HttpResponse<EventListener>> {
  return post<EventListener>(CONDUCTOR_API_URL + '/event', eventListener);
}

// Delete event listener
export function deleteEventListener(name: string): Promise<HttpResponse<any>> {
  const query = '?archiveWorfklow=false';
  return del(CONDUCTOR_API_URL + '/event/' + name + query);
}

// Get all queues
export function getQueues(): Promise<HttpResponse<{ polldata: Array<Queue> }>> {
  return get<{ polldata: Array<Queue> }>(CONDUCTOR_API_URL + '/queue/data');
}

// TODO: Just copy-pasted for now, needs rework in uniflow-api
// Returns hierarchical list of running workflows
export function getWorkflowExecutions(query: string): Promise<HttpResponse<any>> {
  query = 'status:"RUNNING"';
  return get<any>(CONDUCTOR_API_URL + `/executions/?q=&h=&freeText=${query}&start=0&size=`);
}

// TODO: needs rework in uniflow-api
// Get detail of existing instance of workflow
export function getWorkflowInstanceDetail(workflowId: number): Promise<HttpResponse<any>> {
  return get<any>(CONDUCTOR_API_URL + '/id/' + workflowId);
}

// Execute workflow based on payload
export function executeWorkflow(workflowPayload: WorkflowPayload): Promise<HttpResponse<WorkflowPayload>> {
  return post<WorkflowPayload>(CONDUCTOR_API_URL + '/workflow', workflowPayload);
}

// Returns workflowIds of deleted workflow
export function terminateWorkflows(workflowIds: Array<string>): Promise<HttpResponse<Array<string>>> {
  return del<Array<string>>(CONDUCTOR_API_URL + '/bulk/terminate', workflowIds);
}

export function pauseWorkflows(workflowIds: Array<string>): Promise<HttpResponse<Array<string>>> {
  return put<Array<string>>(CONDUCTOR_API_URL + '/bulk/pause', workflowIds);
}

export function resumeWorkflows(workflowIds: Array<string>): Promise<HttpResponse<Array<string>>> {
  return put<Array<string>>(CONDUCTOR_API_URL + '/bulk/resume', workflowIds);
}

export function retryWorkflows(workflowIds: Array<string>): Promise<HttpResponse<Array<string>>> {
  return post<Array<string>>(CONDUCTOR_API_URL + '/bulk/retry', workflowIds);
}

export function restartWorkflows(workflowIds: Array<string>): Promise<HttpResponse<Array<string>>> {
  return post<Array<string>>(CONDUCTOR_API_URL + '/bulk/restart', workflowIds);
}
