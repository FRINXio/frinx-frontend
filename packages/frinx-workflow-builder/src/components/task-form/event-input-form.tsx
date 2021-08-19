import React, { FC, useState } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { EventInputParams, ExtendedTask } from '../../helpers/types';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

type Props = {
  params: EventInputParams;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: EventInputParams) => void;
};

const EventInputForm: FC<Props> = ({ params, onChange, tasks, task }) => {
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
      <FormControl id="action" my={6}>
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
      </FormControl>
      <FormControl id="targetTaskRefName" my={6}>
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
      </FormControl>
      <FormControl id="targetWorkflowId" my={6}>
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
        </AutocompleteTaskReferenceNameMenu>
      </FormControl>
    </>
  );
};

export default EventInputForm;
