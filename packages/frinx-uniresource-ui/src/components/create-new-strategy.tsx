import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Input } from '@chakra-ui/react';
import gql from 'graphql-tag';
import {
  AllocationStrategyLang,
  CreateAllocationStrategyPayload,
  MutationCreateAllocationStrategyArgs,
} from '../__generated__/graphql';

const query = gql`
  mutation AddStrategyMutation($input: CreateAllocationStrategyInput!) {
    CreateAllocationStrategy(input: $input) {
      strategy {
        id
        Name
        Lang
        Script
      }
    }
  }
`;

const CreateNewStrategy: FC = () => {
  const [result, addStrategy] = useMutation<CreateAllocationStrategyPayload, MutationCreateAllocationStrategyArgs>(
    query,
  );
  const [value, setValue] = useState('');

  const sendMutation = () => {
    const variables = {
      input: {
        name: value,
        lang: AllocationStrategyLang.Js,
        script:
          'function invoke() {log(JSON.stringify({respool: resourcePool.ResourcePoolName, currentRes: currentResources}));return {vlan: userInput.desiredVlan};}',
      },
    };
    addStrategy(variables);
  };
  return (
    <div>
      Strategy name
      <Input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder="Basic usage"
      />
      <Button onClick={() => sendMutation()}>Add new Strategy</Button>
    </div>
  );
};

export default CreateNewStrategy;
