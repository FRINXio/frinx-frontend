import { Workflow, TaskDefinition, Queue, WorkflowPayload, EventListener } from 'helpers/types';

// TODO more strict in the future

export function isWorkflow(workflow: unknown): workflow is Workflow {
  return typeof (workflow as Workflow).name === 'string' && typeof (workflow as Workflow).version === 'number';
}

export function isTaskDefinition(taskDefinition: unknown): taskDefinition is TaskDefinition {
  return (
    typeof (taskDefinition as TaskDefinition).name === 'string' &&
    typeof (taskDefinition as TaskDefinition).timeoutPolicy === 'string'
  );
}

export function isArrayTypeOf<T>(array: any, testFunc: any): array is T[] {
    for (const item of array) {
      if (!testFunc(item)) {
        return false;
      }
    }
    return true;
  }

export function isEventListener(eventListener: unknown): eventListener is EventListener {
  return (
    typeof (eventListener as EventListener).name === 'string' &&
    typeof (eventListener as EventListener).event === 'string'
  );
}

export function isQueue(queue: unknown): queue is Queue {
  return typeof (queue as Queue).queueName === 'string' && typeof (queue as Queue).qsize === 'number';
}
