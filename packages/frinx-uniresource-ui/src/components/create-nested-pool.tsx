import React, { FC } from 'react';
import { useMutation } from 'urql';
import { Button } from '@chakra-ui/react';
import { CreateNestedSetPoolInput, CreateNestedSetPoolPayload } from '../generated/graphql';

const query = `
    mutation CreateNestedPoolMutation($input: CreateNestedSetPoolInput!) {
        CreateNestedSetPool(input: $input) {
          pool {
            id
          }
        }
      }
`;

const CreateNestedPool: FC = () => {
  const [result, addStrategy] = useMutation<CreateNestedSetPoolPayload, CreateNestedSetPoolInput>(query);

  const sendMutation = () => {
    // wrong types from schema
    const variables = {
      input: {
        parentResourceId: '17179869200',
        poolDealocationSafetyPeriod: 0,
        poolName: 'NestedTest1',
        resourceTypeId: '25769803777',
        poolValues: [],
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
