import React, { FC } from 'react';
import { useMutation } from 'urql';
import { Button } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { MutationFreeResourceArgs } from '../__generated__/graphql';

const query = gql`
  mutation FreeResourceMutation($poolId: ID!, $input: Map!) {
    FreeResource(poolId: $poolId, input: $input)
  }
`;

const FreeResource: FC = () => {
  const [, addStrategy] = useMutation<string, MutationFreeResourceArgs>(query);

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
