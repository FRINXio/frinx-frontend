import { omit } from 'lodash';
import { EventHandlerQuery } from '../__generated__/graphql';

export function removeTypenamesFromEventHandlerAction(
  action: NonNullable<EventHandlerQuery['eventHandler']>['actions'][0],
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
