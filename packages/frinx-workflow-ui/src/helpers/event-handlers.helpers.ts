import { omit } from 'lodash';
import { EventHandlerAction } from '../components/event-handler-form/event-handler-form';
// import { GetEventHandlersQuery } from '../__generated__/graphql';

export function removeTypenamesFromEventHandlerAction(
  // TODO: FIXME
  // action: NonNullable<EventHandlerQuery['eventHandler']>['actions'][0],
  action: Record<string, unknown>,
) {
  const newAction = omit(action, '__typename');

  return {
    ...newAction,
    ...(newAction.failTask != null && {
      failTask: omit(newAction.failTask, '__typename'),
    }),
    ...(newAction.startWorkflow != null && {
      startWorkflow: omit(newAction.startWorkflow, '__typename'),
    }),
    ...(newAction.completeTask != null && {
      completeTask: omit(newAction.completeTask, '__typename'),
    }),
  };
}

export function removeTypenamesFromActionTasks(action: EventHandlerAction) {
  return {
    completeTask: omit(
      {
        ...action.completeTask,
        output: JSON.stringify(Object.fromEntries(action.completeTask?.output ?? [])),
      },
      ['__typename'],
    ),
    failTask: omit(
      {
        ...action.failTask,
        output: JSON.stringify(Object.fromEntries(action.failTask?.output ?? [])),
      },
      ['__typename'],
    ),
    startWorkflow: omit(
      {
        ...action.startWorkflow,
        input: JSON.stringify(Object.fromEntries(action.startWorkflow?.input ?? [])),
        taskToDomain: JSON.stringify(Object.fromEntries(action.startWorkflow?.taskToDomain ?? [])),
      },
      ['__typename'],
    ),
  };
}

export const hasObjectUniqueKeys = (entries: [string, string | number][] | null | undefined) => {
  if (entries == null) {
    return true;
  }

  const keys = entries.map(([key]) => key);

  return new Set(keys).size === keys.length;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isOfEntriesType = <T>(entries: any | (any[] | undefined)[] | null | undefined): entries is T => {
  if (entries == null) {
    return true;
  }

  if (Array.isArray(entries)) {
    return entries.every((entry) => Array.isArray(entry) && entry.length === 2);
  }

  return false;
};
