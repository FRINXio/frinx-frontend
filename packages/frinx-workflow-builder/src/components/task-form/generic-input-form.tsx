import React, { FC, useState } from 'react';
import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import AutocompleteTaskReferenceName from '../autocomplete-task-reference-name/autocomplete-task-reference-name';
import { useWorkflowTasks } from '../../helpers/task.helpers';

type Props = {
  params: Record<string, string>;
  onChange: (p: Record<string, string>) => void;
};

const GenericInputForm: FC<Props> = ({ params, onChange }) => {
  const [inputsValue, setInputsValue] = useState(params);
  const { tasks } = useWorkflowTasks();

  const handleOnInputFieldChange = (fieldName: string, value: string) => {
    const updatedInputs = {
      ...inputsValue,
      [fieldName]: value,
    };
    setInputsValue(updatedInputs);

    onChange({
      ...updatedInputs,
    });
  };

  return (
    <>
      {Object.keys(inputsValue).map((key) => {
        const value = inputsValue[key];

        return (
          <FormControl id={key} my={6} key={key}>
            <FormLabel>{key}</FormLabel>
            {key === 'template' ? (
              <Textarea
                name={key}
                variant="filled"
                value={value}
                onChange={(event) => {
                  event.persist();
                  onChange({
                    ...params,
                    [key]: event.target.value,
                  });
                }}
              />
            ) : (
              <AutocompleteTaskReferenceName
                inputValue={value}
                tasks={tasks}
                onChange={(val) => {
                  handleOnInputFieldChange(key, val);
                }}
              >
                <Input
                  name={key}
                  variant="filled"
                  value={value}
                  onChange={(event) => {
                    event.persist();
                    handleOnInputFieldChange(key, event.target.value);
                  }}
                />
              </AutocompleteTaskReferenceName>
            )}
          </FormControl>
        );
      })}
    </>
  );
};

export default GenericInputForm;
