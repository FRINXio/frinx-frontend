import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import { DeleteResourceTypeInput, DeleteResourceTypePayload } from '../generated/graphql';

const query = `
    mutation DeleteResourceTypeMutation($input: DeleteResourceTypeInput!) {
        DeleteResourceType(input: $input) {
          resourceTypeId
        }
      }
`;

const DeleteResourceType: FC = () => {
  const [result, addStrategy] = useMutation<DeleteResourceTypePayload, DeleteResourceTypeInput>(query);
  const [value, setValue] = useState('');

  const sendMutation = () => {
    // wrong types from schema
    const variables = {
      input: {
        resourceTypeId: value,
      },
    };
    addStrategy(variables);
  };
  return (
    <div>
      Resource type id
      <Input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder="Basic usage"
      />
      <Button onClick={() => sendMutation()}>Delete</Button>
    </div>
  );
};

export default DeleteResourceType;
