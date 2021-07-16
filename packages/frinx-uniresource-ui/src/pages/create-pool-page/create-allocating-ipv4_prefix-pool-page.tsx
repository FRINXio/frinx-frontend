import { Flex, Heading, Box, useToast } from '@chakra-ui/react';
import gql from 'graphql-tag';
import React, { FC } from 'react';
import { Client, useClient } from 'urql';
import CreateAllocatingIpv4PrefixPoolForm from '../../components/create-allocating-ipv4_prefix-pool-form';

import { CreateAllocationPoolMutation } from '../../__generated__/graphql';

const CREATE_ALLOCATING_POOL_MUTATION = gql`
  mutation CreateAllocationPool($input: CreateAllocatingPoolInput!) {
    CreateAllocatingPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

type FormValues = {
  poolName: string;
  dealocationSafetyPeriod: number;
  allocationStrategyId: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int' | 'string'>;
};

function createPool(mutationFn: Client['mutation'], values: FormValues): ReturnType<Client['mutation']> {
  return mutationFn<CreateAllocationPoolMutation>(CREATE_ALLOCATING_POOL_MUTATION, {
    input: {
      poolName: values.poolName,
      poolProperties: values.poolProperties,
      allocationStrategyId: values.allocationStrategyId,
      dealocationSafetyPeriod: values.dealocationSafetyPeriod,
      poolPropertyTypes: values.poolPropertyTypes,
    },
  });
}

const CreateAllocatingPoolPage: FC = () => {
  const client = useClient();
  const toast = useToast({
    title: 'Successfully created pool',
    duration: 1500,
    isClosable: true,
    status: 'success',
  });

  const handleFormSubmit = (data: FormValues) => {
    createPool(client.mutation.bind(client), data)
      .toPromise()
      .then(() => toast());
  };

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Create new Pool
        </Heading>
      </Flex>
      <Box background="white" paddingY={8} paddingX={4}>
        <CreateAllocatingIpv4PrefixPoolForm onFormSubmit={handleFormSubmit} />
      </Box>
    </>
  );
};

export default CreateAllocatingPoolPage;
