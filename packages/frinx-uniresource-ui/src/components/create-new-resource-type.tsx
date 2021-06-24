import React, { FC, useState } from 'react';
import { gql, useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import { CreateResourceTypePayload, MutationCreateResourceTypeArgs } from '../__generated__/graphql';

const query = gql`
  mutation AddResourceTypeMutation($input: CreateResourceTypeInput!) {
    CreateResourceType(input: $input) {
      resourceType {
        Name
      }
    }
  }
`;

const CreateNewResourceType: FC = () => {
  const [, addStrategy] = useMutation<CreateResourceTypePayload, MutationCreateResourceTypeArgs>(query);
  const [value, setValue] = useState('');

  const sendMutation = () => {
    const variables = {
      input: {
        resourceName: value,
        resourceProperties: {},
      },
    };
    addStrategy(variables);
  };
  return (
    <div>
      Resource Type name
      <Input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder="Basic usage"
      />
      <Button onClick={() => sendMutation()}>Add new Resource Type</Button>
    </div>
  );
};

export default CreateNewResourceType;
