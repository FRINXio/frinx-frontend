import React, { FC, useState } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { EventInputParams, ExtendedTask } from '../../helpers/types';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

export const EventInputParamsSchema = yup.object({
  inputParameters: yup.object({
    targetWorkflowId: yup.string().required('Target workflow id is required'),
    targetTaskRefNameId: yup.string().required('Target taskRefName is required'),
    action: yup.string().required('Action is required'),
  }),
});

type Props = {
  params: EventInputParams;
  errors: FormikErrors<{ inputParameters: EventInputParams }>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: EventInputParams) => void;
};

const EventInputForm: FC<Props> = ({ params, errors, onChange, tasks, task }) => {
  const { action, targetTaskRefName, targetWorkflowId } = params;

  const [targetTaskRefNameVal, setTargetTaskRefName] = useState(targetTaskRefName);
  const [targetWorkflowIdVal, setTargetWorkflowId] = useState(targetWorkflowId);

  const handleOnChange = (updatedInputValue: string, key: string) => {
    if (key === 'targetTaskRefName') {
      setTargetTaskRefName(updatedInputValue);
    } else {
      setTargetWorkflowId(updatedInputValue);
    }

    onChange({ ...params, [key]: updatedInputValue });
  };

  return (
    <>
      <FormControl id="action" my={6} isInvalid={errors.inputParameters?.action != null}>
        <FormLabel>Action</FormLabel>
        <Input
          name="action"
          variant="filled"
          value={action}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              action: event.target.value,
            });
          }}
        />
        <FormErrorMessage>{errors.inputParameters?.action}</FormErrorMessage>
      </FormControl>
      <FormControl id="targetTaskRefName" my={6} isInvalid={errors.inputParameters?.targetTaskRefName != null}>
        <FormLabel>Target taskRefName</FormLabel>
        <AutocompleteTaskReferenceNameMenu
          tasks={tasks}
          task={task}
          onChange={(updatedInputValue) => handleOnChange(updatedInputValue, 'targetTaskRefName')}
          inputValue={targetTaskRefNameVal}
        >
          <Input
            autoComplete="off"
            name="targetTaskRefName"
            variant="filled"
            value={targetTaskRefNameVal}
            onChange={(event) => {
              event.persist();
              handleOnChange(event.target.value, 'targetTaskRefName');
            }}
          />
        </AutocompleteTaskReferenceNameMenu>
        <FormErrorMessage>{errors.inputParameters?.targetTaskRefName}</FormErrorMessage>
      </FormControl>
      <FormControl id="targetWorkflowId" my={6} isInvalid={errors.inputParameters?.targetWorkflowId != null}>
        <FormLabel>Target workflow ID</FormLabel>
        <AutocompleteTaskReferenceNameMenu
          tasks={tasks}
          task={task}
          onChange={(updatedInputValue) => {
            handleOnChange(updatedInputValue, 'targetWorkflowId');
          }}
          inputValue={targetWorkflowIdVal}
        >
          <Input
            autoComplete="off"
            name="targetWorkflowId"
            variant="filled"
            value={targetWorkflowIdVal}
            onChange={(event) => {
              event.persist();
              handleOnChange(event.target.value, 'targetWorkflowId');
            }}
          />
          <FormErrorMessage>{errors.inputParameters?.targetWorkflowId}</FormErrorMessage>
        </AutocompleteTaskReferenceNameMenu>
      </FormControl>
    </>
  );
};

export default EventInputForm;
