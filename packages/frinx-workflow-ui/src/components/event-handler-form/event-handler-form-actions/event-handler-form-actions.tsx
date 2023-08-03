import React, { Fragment, VoidFunctionComponent } from 'react';
import { EventHandlerAction } from '../event-handler-form';
import StartWorkflowAction from './event-handler-form-actions-start-workflow';
import TaskAction from './event-handler-form-actions-task';

type Props = {
  values: EventHandlerAction[];
  onChange: (actions: EventHandlerAction[]) => void;
  onActionRemove: (index: number) => void;
};

const EventHandlerFormActions: VoidFunctionComponent<Props> = ({ values, onChange, onActionRemove }) => {
  const handleOnActionChange = (event: EventHandlerAction, index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1, event);
    onChange(newValues);
  };

  const handleOnActionRemove = (index: number) => {
    onActionRemove(index);
  };

  return (
    <>
      {values.map((action, index) => (
        <Fragment key={action.id}>
          {action.action === 'start_workflow' && (
            <StartWorkflowAction
              values={action.startWorkflow ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, startWorkflow: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'complete_task' && (
            <TaskAction
              isCompleteTask
              values={action.completeTask ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, completeTask: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'fail_task' && (
            <TaskAction
              isCompleteTask={false}
              values={action.failTask ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, failTask: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};

export default EventHandlerFormActions;
