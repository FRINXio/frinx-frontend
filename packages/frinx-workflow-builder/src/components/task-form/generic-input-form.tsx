import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { ExtendedTask } from '@frinx/shared/src';
import React, { FC, useState } from 'react';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

type Props = {
  params: Record<string, string>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: Record<string, string>) => void;
};

const GenericInputForm: FC<Props> = ({ params, onChange, tasks, task }) => {
  const [inputsValue, setInputsValue] = useState(params);

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
                  handleOnInputFieldChange(key, event.target.value);
                }}
              />
            ) : (
              <AutocompleteTaskReferenceNameMenu
                inputValue={value}
                tasks={tasks}
                task={task}
                onChange={(val) => {
                  handleOnInputFieldChange(key, val);
                }}
              >
                <Input
                  autoComplete="off"
                  name={key}
                  variant="filled"
                  value={value}
                  onChange={(event) => {
                    event.persist();
                    handleOnInputFieldChange(key, event.target.value);
                  }}
                />
              </AutocompleteTaskReferenceNameMenu>
            )}
          </FormControl>
        );
      })}
    </>
  );
};

export default GenericInputForm;
