import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import { DeleteAllocationStrategyPayload, MutationDeleteAllocationStrategyArgs } from '../__generated__/graphql';

const query = `
    mutation DeleteStrategyMutation($input: DeleteAllocationStrategyInput!) {
        DeleteAllocationStrategy(input: $input) {
          strategy {
            id
          }
        }
  }
`;

const DeleteStrategy: FC = () => {
  const [result, addStrategy] = useMutation<DeleteAllocationStrategyPayload, MutationDeleteAllocationStrategyArgs>(
    query,
  );
  const [value, setValue] = useState('');

  const sendMutation = () => {
    const variables = {
      input: {
        allocationStrategyId: value,
      },
    };
    addStrategy(variables);
  };
  return (
    <div>
      Strategy id
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

export default DeleteStrategy;
