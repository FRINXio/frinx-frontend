import React, { FC } from 'react';
import { useMutation } from 'urql';
import { Button } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { CreateNestedSetPoolPayload, MutationCreateNestedSetPoolArgs } from '../__generated__/graphql';

const query = gql`
  mutation CreateNestedPoolMutation($input: CreateNestedSetPoolInput!) {
    CreateNestedSetPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

const CreateNestedPool: FC = () => {
  const [, addStrategy] = useMutation<CreateNestedSetPoolPayload, MutationCreateNestedSetPoolArgs>(query);

  const sendMutation = () => {
    const variables = {
      input: {
        parentResourceId: '17179869200',
        poolDealocationSafetyPeriod: 0,
        poolName: 'NestedTest1',
        resourceTypeId: '25769803777',
        poolValues: [],
        tags: ['tag1', 'tag2'],
      },
    };
    addStrategy(variables);
  };
  return (
    <div>
      <Button onClick={() => sendMutation()}>Create Nested Pool</Button>
    </div>
  );
};

export default CreateNestedPool;
