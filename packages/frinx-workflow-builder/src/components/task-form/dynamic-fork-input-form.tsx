import React, { FC } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { DynamicForkInputParams } from '../../helpers/types';

type Props = {
  params: DynamicForkInputParams;
  onChange: (p: DynamicForkInputParams) => void;
};

const DynamicForkInputForm: FC<Props> = ({ params, onChange }) => {
  const { dynamic_tasks, dynamic_tasks_i, expectedName, expectedType } = params;

  return (
    <>
      <FormControl id="dynamic_tasks" my={6}>
        <FormLabel>Dynamic tasks</FormLabel>
        <Input
          name="dynamic_tasks"
          variant="filled"
          value={dynamic_tasks}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              dynamic_tasks: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl id="dynamic_tasks_i" my={6}>
        <FormLabel>Dynamic tasks i</FormLabel>
        <Input
          name="dynamic_tasks_i"
          variant="filled"
          value={dynamic_tasks_i}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              dynamic_tasks_i: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl id="expectedName" my={6}>
        <FormLabel>Expected name</FormLabel>
        <Input
          name="expectedName"
          variant="filled"
          value={expectedName}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              expectedName: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl id="expectedType" my={6}>
        <FormLabel>Expected type</FormLabel>
        <Input
          name="expectedType"
          variant="filled"
          value={expectedType}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              expectedType: event.target.value,
            });
          }}
        />
      </FormControl>
    </>
  );
};

export default DynamicForkInputForm;
