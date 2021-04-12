import React, { FC } from 'react';
import { useMutation } from 'urql';
import { Button } from '@chakra-ui/react';
import {
  MutationFreeResourceArgs,
} from '../generated/graphql';

const query = `
    mutation FreeResourceMutation($poolId: ID!, $input: Map!) {
        FreeResource(poolId: $poolId, input: $input)
      }
`;

const FreeResource: FC = () => {
  const [result, addStrategy] = useMutation<string, MutationFreeResourceArgs>(query);

  const sendMutation = () => {
    const variables = {
      input: {},
      poolId: '21474836482',
    };
    addStrategy(variables);
  };
  return (
    <div>
      <Button onClick={() => sendMutation()}>Free Resource</Button>
    </div>
  );
};

export default FreeResource;
