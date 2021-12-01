/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Workflow, TaskDefinition, Queue, EventListener } from './types';

// TODO more strict in the future

export function isWorkflow(workflow: unknown): workflow is Workflow {
  if (workflow !== null && typeof workflow === 'object') {
    return 'name' in workflow!;
  }

  return false;
}

export function isTaskDefinition(taskDefinition: unknown): taskDefinition is TaskDefinition {
  if (taskDefinition !== null && typeof taskDefinition === 'object') {
    return 'name' in taskDefinition!;
  }

  return false;
}

export function isArrayTypeOf<T>(array: unknown, testFunc: (value: unknown) => value is T): array is T[] {
  return Array.isArray(array) && array.every(testFunc);
}

export function isEventListener(eventListener: unknown): eventListener is EventListener {
  if (eventListener !== null && typeof eventListener === 'object') {
    return 'name' in eventListener!;
  }

  return false;
}

export function isQueue(queue: unknown): queue is Queue {
  if (queue !== null && typeof queue === 'object') {
    return 'queueName' in queue!;
  }

  return false;
}
