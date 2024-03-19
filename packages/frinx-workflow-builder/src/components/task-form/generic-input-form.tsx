import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { Editor, ExtendedTask, jsonParse } from '@frinx/shared';
import React, { FC, useState } from 'react';

type Props = {
  params: Record<string, string>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: Record<string, string>) => void;
};

const GenericInputForm: FC<Props> = ({ params, onChange }) => {
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
              <>
                {typeof value === 'object' && (
                  <Editor
                    language="json"
                    value={JSON.stringify(value, null, 2)}
                    onChange={(e) => {
                      handleOnInputFieldChange(key, JSON.parse(e ?? '{}'));
                    }}
                  />
                )}
                {typeof value !== 'object' && (
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
                )}
              </>
            )}
          </FormControl>
        );
      })}
    </>
  );
};

export default GenericInputForm;
