import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import { DeleteResourcePoolInput, DeleteResourcePoolPayload } from '../generated/graphql';

const query = `
    mutation DeletePoolMutation($input: DeleteResourcePoolInput!) {
        DeleteResourcePool(input: $input) {
          resourcePoolId
        }
      }
`;

const DeletePool: FC = () => {
  const [result, addStrategy] = useMutation<DeleteResourcePoolPayload, DeleteResourcePoolInput>(query);
  const [value, setValue] = useState('');

  const sendMutation = () => {
    // wrong types from schema
    const variables = {
      input: {
        resourcePoolId: value,
      },
    };
    addStrategy(variables);
  };
  return (
    <div>
      Pool id
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

export default DeletePool;
