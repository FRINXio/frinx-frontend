import React, { FC } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { EventInputParams } from '../../helpers/types';

type Props = {
  params: EventInputParams;
  onChange: (p: EventInputParams) => void;
};

const EventInputForm: FC<Props> = ({ params, onChange }) => {
  const { action, targetTaskRefName, targetWorkflowId } = params;

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
        <Input
          name="targetTaskRefName"
          variant="filled"
          value={targetTaskRefName}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              targetTaskRefName: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl id="targetWorkflowId" my={6}>
        <FormLabel>Target workflow ID</FormLabel>
        <Input
          name="targetWorkflowId"
          variant="filled"
          value={targetWorkflowId}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              targetWorkflowId: event.target.value,
            });
          }}
        />
      </FormControl>
    </>
  );
};

export default EventInputForm;
