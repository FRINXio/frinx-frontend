import React, { FC, useState } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { EventInputParams } from '../../helpers/types';
import AutocompleteTaskReferenceName from '../autocomplete-task-reference-name/autocomplete-task-reference-name';
import { useWorkflowTasks } from '../../helpers/task.helpers';

type Props = {
  params: EventInputParams;
  onChange: (p: EventInputParams) => void;
};

const EventInputForm: FC<Props> = ({ params, onChange }) => {
  const { action, targetTaskRefName, targetWorkflowId } = params;

  const { tasks } = useWorkflowTasks();
  const [targetTaskRefNameVal, setTargetTaskRefName] = useState(targetTaskRefName);
  const [targetWorkflowIdVal, setTargetWorkflowId] = useState(targetWorkflowId);

  const handleOnChange = (updatedInputValue: string, key: string) => {
    // eslint-disable-next-line no-unused-expressions
    key === 'targetTaskRefName' ? setTargetTaskRefName(updatedInputValue) : setTargetWorkflowId(updatedInputValue);

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
        <AutocompleteTaskReferenceName
          tasks={tasks}
          onChange={(updatedInputValue) => handleOnChange(updatedInputValue, 'targetTaskRefName')}
          inputValue={targetTaskRefNameVal}
        >
          <Input
            name="targetTaskRefName"
            variant="filled"
            value={targetTaskRefNameVal}
            onChange={(event) => {
              event.persist();
              handleOnChange(event.target.value, 'targetTaskRefName');
            }}
          />
        </AutocompleteTaskReferenceName>
      </FormControl>
      <FormControl id="targetWorkflowId" my={6}>
        <FormLabel>Target workflow ID</FormLabel>
        <AutocompleteTaskReferenceName
          tasks={tasks}
          onChange={(updatedInputValue) => handleOnChange(updatedInputValue, 'targetWorkflowId')}
          inputValue={targetWorkflowIdVal}
        >
          <Input
            name="targetWorkflowId"
            variant="filled"
            value={targetWorkflowIdVal}
            onChange={(event) => {
              event.persist();
              handleOnChange(event.target.value, 'targetWorkflowId');
            }}
          />
        </AutocompleteTaskReferenceName>
      </FormControl>
    </>
  );
};

export default EventInputForm;
