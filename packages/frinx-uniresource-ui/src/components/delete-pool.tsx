import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { DeleteResourcePoolPayload, MutationDeleteResourcePoolArgs } from '../__generated__/graphql';

const query = gql`
  mutation DeletePoolMutation($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
    }
  }
`;

const DeletePool: FC = () => {
  const [, addStrategy] = useMutation<DeleteResourcePoolPayload, MutationDeleteResourcePoolArgs>(query);
  const [value, setValue] = useState('');

  const sendMutation = () => {
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
