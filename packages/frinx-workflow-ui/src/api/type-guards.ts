import { Workflow, TaskDefinition, Queue, WorkflowPayload, EventListener } from '../helpers/types';

// TODO more strict in the future

export function isWorkflow(workflow: unknown): workflow is Workflow {
  if (workflow !== null && typeof workflow === 'object') {
    return (
      'name' in workflow! &&
      typeof workflow['name'] === 'string' &&
      'version' in workflow! &&
      typeof workflow['version'] === 'number'
    );
  }

  return false;
}

export function isTaskDefinition(taskDefinition: unknown): taskDefinition is TaskDefinition {
  if (taskDefinition !== null && typeof taskDefinition === 'object') {
    return (
      'name' in taskDefinition! &&
      typeof taskDefinition['name'] === 'string' &&
      'timeoutPolicy' in taskDefinition! &&
      typeof taskDefinition['timeoutPolicy'] === 'number'
    );
  }

  return false;
}

export function isArrayTypeOf<T>(array: unknown, testFunc: (value: unknown) => value is T): array is T[] {
  return Array.isArray(array) && array.every(testFunc);
}

export function isEventListener(eventListener: unknown): eventListener is EventListener {
  if (eventListener !== null && typeof eventListener === 'object') {
    return (
      'name' in eventListener! &&
      typeof eventListener['name'] === 'string' &&
      'event' in eventListener! &&
      typeof eventListener['event'] === 'string'
    );
  }

  return false;
}

export function isQueue(queue: unknown): queue is Queue {
  if (queue !== null && typeof queue === 'object') {
    return (
      'queueName' in queue! &&
      typeof queue['queueName'] === 'string' &&
      'qsize' in queue! &&
      typeof queue['qsize'] === 'number'
    );
  }

  return false;
}
