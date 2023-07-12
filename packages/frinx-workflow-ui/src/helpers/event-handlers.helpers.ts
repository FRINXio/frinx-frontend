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
