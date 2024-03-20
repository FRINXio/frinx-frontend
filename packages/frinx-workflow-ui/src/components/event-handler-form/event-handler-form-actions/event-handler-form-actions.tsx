import { Text } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import React, { Fragment, VoidFunctionComponent } from 'react';
import { EventHandlerAction } from '../event-handler-form';
import StartWorkflowAction from './event-handler-form-actions-start-workflow';
import TaskAction from './event-handler-form-actions-task';

type Props = {
  values: EventHandlerAction[];
  errors: string[] | FormikErrors<EventHandlerAction>[];
  onChange: (actions: EventHandlerAction[]) => void;
  onActionRemove: (index: number) => void;
};

const EventHandlerFormActions: VoidFunctionComponent<Props> = ({ values, errors, onChange, onActionRemove }) => {
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
            <>
              <StartWorkflowAction
                values={action.startWorkflow ?? {}}
                isInvalid={errors.at(index) != null}
                onChange={(event) => handleOnActionChange({ ...action, startWorkflow: event }, index)}
                onRemove={() => handleOnActionRemove(index)}
              />
              {errors.at(index) != null && <Text color="red.500">This action is not complete {}</Text>}
            </>
          )}

          {action.action === 'complete_task' && (
            <>
              <TaskAction
                isCompleteTask
                values={action.completeTask ?? {}}
                isInvalid={errors.at(index) != null}
                onChange={(event) => handleOnActionChange({ ...action, completeTask: event }, index)}
                onRemove={() => handleOnActionRemove(index)}
              />
              {errors.at(index) != null && <Text color="red.500">This action is not complete</Text>}
            </>
          )}

          {action.action === 'fail_task' && (
            <>
              <TaskAction
                isCompleteTask={false}
                values={action.failTask ?? {}}
                isInvalid={errors.at(index) != null}
                onChange={(event) => handleOnActionChange({ ...action, failTask: event }, index)}
                onRemove={() => handleOnActionRemove(index)}
              />
              {errors.at(index) != null && <Text color="red.500">This action is not complete</Text>}
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};

export default EventHandlerFormActions;
