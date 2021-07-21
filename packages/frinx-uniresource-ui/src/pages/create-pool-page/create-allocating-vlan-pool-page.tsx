import { Flex, Heading, Box, useToast, Spinner } from '@chakra-ui/react';
import gql from 'graphql-tag';
import React, { FC, useEffect, useState } from 'react';
import { Client, useClient, useQuery } from 'urql';
import CreateAllocatingVlanPoolForm from './create-allocating-vlan-pool-form';

import {
  CreateAllocationPoolMutation,
  PossibleParentPoolsQuery,
  ResourceTypeByNameQuery,
  AllocationStrategyByNameQuery,
} from '../../__generated__/graphql';

const CREATE_ALLOCATING_POOL_MUTATION = gql`
  mutation CreateAllocationPool($input: CreateAllocatingPoolInput!) {
    CreateAllocatingPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

const ALLOCATION_STRATEGY_QUERY = gql`
  query AllocationStrategyByName {
    QueryAllocationStrategies(byName: "vlan") {
      Name
      id
    }
  }
`;

const RESOURCE_TYPE_QUERY = gql`
  query ResourceTypeByName {
    QueryResourceTypes(byName: "vlan") {
      Name
      id
    }
  }
`;

const POSSIBLE_PARENT_POOLS_QUERY = gql`
  query PossibleParentPools($resourceTypeId: ID!) {
    QueryResourcePools(resourceTypeId: $resourceTypeId) {
      Name
      id
    }
  }
`;

type FormValues = {
  poolName: string;
  dealocationSafetyPeriod: number;
  allocationStrategyId: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int'>;
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

type Props = {
  onCreateSuccess: () => void;
};

const CreateAllocatingVlanPoolPage: FC<Props> = ({ onCreateSuccess }) => {
  const client = useClient();
  const toast = useToast({
    title: 'Successfully created pool',
    duration: 1500,
    isClosable: true,
    status: 'success',
  });

  const [possibleParentPools, setPossibleParentPools] = useState([]);

  const [{ data: resourceTypeData, fetching: fetchingResourceType }] = useQuery<ResourceTypeByNameQuery>({
    query: RESOURCE_TYPE_QUERY,
  });
  const [{ data: allocationStrategy, fetching: fetchingAllocationStrategy }] = useQuery<AllocationStrategyByNameQuery>({
    query: ALLOCATION_STRATEGY_QUERY,
  });

  const resourceTypeId = resourceTypeData?.QueryResourceTypes[0].id;
  const allocationStrategyId = allocationStrategy?.QueryAllocationStrategies[0].id;

  const [result] = useQuery<PossibleParentPoolsQuery>({
    query: POSSIBLE_PARENT_POOLS_QUERY,
    variables: { resourceTypeId },
  });

  const { data: parentPools, fetching: possibleParentPoolsFetching } = result;

  useEffect(() => {
    if (possibleParentPools) {
      setPossibleParentPools(
        parentPools?.QueryResourcePools.map((pool) => {
          return { ...pool, name: pool.Name };
        }),
      );
    }
  }, [possibleParentPools, parentPools]);

  const handleFormSubmit = (data: FormValues) => {
    createPool(client.mutation.bind(client), data)
      .toPromise()
      .then(() => {
        toast();
        onCreateSuccess();
      });
  };

  if (fetchingResourceType || fetchingAllocationStrategy || possibleParentPoolsFetching) {
    return <Spinner variant="2xl" />;
  }

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Create new Pool
        </Heading>
      </Flex>
      <Box background="white" paddingY={8} paddingX={4}>
        <CreateAllocatingVlanPoolForm
          onFormSubmit={handleFormSubmit}
          resourceTypeId={resourceTypeId}
          allocationStrategyId={allocationStrategyId}
          possibleParentPools={possibleParentPools}
        />
      </Box>
    </>
  );
};

export default CreateAllocatingVlanPoolPage;
