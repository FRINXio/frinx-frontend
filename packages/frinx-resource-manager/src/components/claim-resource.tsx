import React, { FC } from 'react';
import { useMutation } from 'urql';
import { Button } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { ClaimResourceMutationMutation, ClaimResourceMutationMutationVariables } from '../__generated__/graphql';

const query = gql`
  mutation ClaimResourceMutation($poolId: ID!, $description: String, $userInput: Map!) {
    resourceManager {
      ClaimResource(poolId: $poolId, description: $description, userInput: $userInput) {
        id
      }
    }
  }
`;

const ClaimResource: FC = () => {
  const [, addStrategy] = useMutation<ClaimResourceMutationMutation, ClaimResourceMutationMutationVariables>(query);

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
