import React, { FC } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

type Props = {
  params: Record<string, string>;
  onChange: (p: Record<string, string>) => void;
};

const GenericInputForm: FC<Props> = ({ params, onChange }) => {
  return (
    <>
      {Object.keys(params).map((key) => {
        const value = params[key];

        return (
          <FormControl id={key} my={6} key={key}>
            <FormLabel>{key}</FormLabel>
            <Input
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
          </FormControl>
        );
      })}
    </>
  );
};

export default GenericInputForm;
