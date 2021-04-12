import React, { FC } from 'react';
import { useMutation } from 'urql';
import { Button } from '@chakra-ui/react';
import { MutationClaimResourceArgs, Resource } from '../__generated__/graphql';

const query = `
    mutation ClaimResourceMutation($poolId: ID!, $description: String, $userInput: Map!) {
        ClaimResource(poolId: $poolId, description: $description, userInput: $userInput) {
          id
        }
      }
`;

const ClaimResource: FC = () => {
  const [result, addStrategy] = useMutation<Resource, MutationClaimResourceArgs>(query);

  const sendMutation = () => {
    const variables = {
      poolId: '21474836482',
      userInput: {},
    };
    addStrategy(variables);
  };
  return (
    <div>
      <Button onClick={() => sendMutation()}>Claim Resource</Button>
    </div>
  );
};

export default ClaimResource;
