import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { DeleteResourceTypePayload, MutationDeleteResourceTypeArgs } from '../__generated__/graphql';

const query = gql`
  mutation DeleteResourceTypeMutation($input: DeleteResourceTypeInput!) {
    DeleteResourceType(input: $input) {
      resourceTypeId
    }
  }
`;

const DeleteResourceType: FC = () => {
  const [, addStrategy] = useMutation<DeleteResourceTypePayload, MutationDeleteResourceTypeArgs>(query);
  const [value, setValue] = useState('');

  const sendMutation = () => {
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
