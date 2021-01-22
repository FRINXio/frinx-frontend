import { Workflow, BaseTask, EventTask } from 'helpers/types';
import { get, post, put, del, HttpResponse } from './api-helpers';

const CONDUCTOR_API_URL: string = 'localhost:8080/uniflow/api/conductor';

// Returns list of all workflows
export function getWorkflows(): Promise<HttpResponse<Workflow>> {
  return get<Workflow>(CONDUCTOR_API_URL + '/metadata/workflow');
}

// Returns list of all scheduled workflows
export function getScheduledWorkflows(): Promise<HttpResponse<Workflow>> {
  return get<Workflow>(CONDUCTOR_API_URL + '/schedule/metadata/workflow');
}

// Registers new task definition, returns registered task
export function registerTaskDefinition(task: BaseTask): Promise<HttpResponse<BaseTask>> {
  return post<BaseTask>(CONDUCTOR_API_URL + '/metadata/taskdef/', task);
}

// Returns task definition
export function getTaskDefinition(name: string): Promise<HttpResponse<BaseTask>> {
  return get<BaseTask>(CONDUCTOR_API_URL + '/metadata/taskdef/' + name);
}

// Deletes task definition, return deleted task definition
export function deleteTaskDefinition(name: string): Promise<HttpResponse<BaseTask>> {
  return del<BaseTask>(CONDUCTOR_API_URL + '/metadata/taskdef/' + name);
}

// Returns single workflow based on name and version
export function getWorkflow(name: string, version: number): Promise<HttpResponse<Workflow>> {
  return get<Workflow>(CONDUCTOR_API_URL + `/metadata/workflow/${name}/${version}`);
}

// Registers one or multiple workflows, returns registered workflow
export function registerWorkflow(workflows: Array<Workflow>): Promise<HttpResponse<Workflow>> {
  return put<Workflow>(CONDUCTOR_API_URL + '/metadata/', workflows);
}

// TODO: we need EventListener type
// Returns list of event listeners
export function getEvents(): Promise<HttpResponse<EventTask>> {
  return get<EventTask>(CONDUCTOR_API_URL + '/events');
}

// TODO: Queue type
// Returns list of queues
export function getQueues(): Promise<HttpResponse<any>> {
  return get<any>(CONDUCTOR_API_URL + '/queue/data');
}

// TODO: Just copy-pasted for now, needs rework. Execution type.
// Returns list of running workflows
export function getWorkflowExecutions(query: string): Promise<HttpResponse<any>> {
  query = 'status:"RUNNING"';
  return get<any>(CONDUCTOR_API_URL + `/executions/?q=&h=&freeText=${query}&start=0&size=`);
}

// TODO: type
// Returns detail of existing instance of workflow (?)
export function getWorkflowInstanceDetail(workflowId: number): Promise<HttpResponse<any>> {
  return get<any>(CONDUCTOR_API_URL + '/id/' + workflowId);
}

// TODO: payload type (name, version + inputs ...)
// Returns workflowId - id of current workflow intance
export function executeWorkflow(workflowPayload: any): Promise<HttpResponse<any>> {
  return post<number>(CONDUCTOR_API_URL + '/workflow', workflowPayload);
}

// TODO add bulk operations