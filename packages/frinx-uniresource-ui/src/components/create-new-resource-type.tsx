import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import { CreateResourceTypeInput, CreateResourceTypePayload } from '../generated/graphql';

const query = `
    mutation AddResourceTypeMutation($input: CreateResourceTypeInput!) {
        CreateResourceType(input: $input) {
          resourceType {
            Name
          }
        }
  }
`;

const CreateNewResourceType: FC = () => {
  const [result, addStrategy] = useMutation<CreateResourceTypePayload, CreateResourceTypeInput>(query);
  const [value, setValue] = useState('');

  const sendMutation = () => {
    const variables = {
      input: {
        resourceName: value,
        resourceProperties: new Map([]),
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
