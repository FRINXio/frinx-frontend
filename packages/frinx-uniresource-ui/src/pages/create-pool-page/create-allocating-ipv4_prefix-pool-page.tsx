import { Flex, Heading, Box, useToast, Spinner } from '@chakra-ui/react';
import gql from 'graphql-tag';
import React, { FC } from 'react';
import { useMutation, useQuery } from 'urql';
import { isEmpty } from 'lodash';
import CreateAllocatingIpv4PrefixPoolForm from './create-allocating-ipv4_prefix-pool-form';

import {
  GetIpv4ParentPoolsQuery,
  GetIpv4ResourceTypeQuery,
  GetIpv4AllocationStrategyQuery,
  CreateAllocatingPoolPayload,
  MutationCreateAllocatingPoolArgs,
  CreateNestedAllocatingPoolPayload,
  MutationCreateNestedAllocatingPoolArgs,
} from '../../__generated__/graphql';

const CREATE_ALLOCATING_POOL_MUTATION = gql`
  mutation CreateIPv4AllocationPool($input: CreateAllocatingPoolInput!) {
    CreateAllocatingPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

const CREATE_NESTED_ALLOCATING_POOL = gql`
  mutation CreateNestedIPv4AllocationPool($input: CreateNestedAllocatingPoolInput!) {
    CreateNestedAllocatingPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

const ALLOCATION_STRATEGY_QUERY = gql`
  query GetIpv4AllocationStrategy {
    QueryAllocationStrategies(byName: "ipv4_prefix") {
      Name
      id
    }
  }
`;

const RESOURCE_TYPE_QUERY = gql`
  query GetIpv4ResourceType {
    QueryResourceTypes(byName: "ipv4_prefix") {
      Name
      id
    }
  }
`;

const POSSIBLE_PARENT_POOLS_QUERY = gql`
  query GetIpv4ParentPools {
    QueryResourcePools {
      id
      Name
      ResourceType {
        id
      }
    }
  }
`;

const getParentPools = (parentPools: GetIpv4ParentPoolsQuery | undefined, resourceTypeId: string) => {
  if (parentPools) {
    const result = parentPools.QueryResourcePools.filter((pool) => pool.ResourceType.id === resourceTypeId);

    return isEmpty(result) ? null : result;
  }

  return null;
};

type FormValues = {
  poolName: string;
  tags: string[];
  poolDealocationSafetyPeriod: number;
  allocationStrategyId: string;
  resourceTypeId: string;
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
  parentResourceId?: undefined;
};

type Props = {
  onCreateSuccess: () => void;
};

const CreateAllocatingIPv4PoolPage: FC<Props> = ({ onCreateSuccess }) => {
  const toast = useToast();
  const [, createPool] = useMutation<CreateAllocatingPoolPayload, MutationCreateAllocatingPoolArgs>(
    CREATE_ALLOCATING_POOL_MUTATION,
  );

  const [, createNestedPool] = useMutation<CreateNestedAllocatingPoolPayload, MutationCreateNestedAllocatingPoolArgs>(
    CREATE_NESTED_ALLOCATING_POOL,
  );

  const [{ data: resourceTypeData, fetching: resourceTypeFetching }] = useQuery<GetIpv4ResourceTypeQuery>({
    query: RESOURCE_TYPE_QUERY,
  });
  const [{ data: allocationStrategy, fetching: allocationStrategyFetching }] = useQuery<GetIpv4AllocationStrategyQuery>(
    {
      query: ALLOCATION_STRATEGY_QUERY,
    },
  );
  const [result] = useQuery<GetIpv4ParentPoolsQuery>({
    query: POSSIBLE_PARENT_POOLS_QUERY,
  });

  const { data: parentPools, fetching: parentPoolsFetching } = result;

  if (resourceTypeFetching || allocationStrategyFetching || parentPoolsFetching) {
    return <Spinner variant="xl" />;
  }

  if (resourceTypeData == null || allocationStrategy == null) {
    return null;
  }

  const resourceTypeId = resourceTypeData.QueryResourceTypes[0].id;
  const allocationStrategyId = allocationStrategy.QueryAllocationStrategies[0].id;
  const possibleParentPools = getParentPools(parentPools, resourceTypeId);

  const handleFormSubmit = (data: FormValues, isNested: boolean) => {
    const allocatingPool = {
      input: data,
    };

    if (isNested) {
      const { input: nestedPool } = allocatingPool;
      createNestedPool({
        input: {
          allocationStrategyId: nestedPool.allocationStrategyId,
          parentResourceId: nestedPool.parentResourceId || '',
          poolName: nestedPool.poolName,
          resourceTypeId: nestedPool.resourceTypeId,
          poolDealocationSafetyPeriod: nestedPool.poolDealocationSafetyPeriod,
        },
      })
        .then(() => {
          toast({
            title: 'Successfully created nested pool',
            duration: 1500,
            isClosable: true,
            status: 'success',
          });
          onCreateSuccess();
        })
        .catch(() => {
          toast({
            title: 'There was a problem with addition of nested pool',
            duration: 1500,
            isClosable: true,
            status: 'error',
          });
        });
    } else {
      createPool(allocatingPool)
        .then(() => {
          toast({
            title: 'Successfully created pool',
            duration: 1500,
            isClosable: true,
            status: 'success',
          });
          onCreateSuccess();
        })
        .catch(() => {
          toast({
            title: 'There was a problem with addition of pool',
            duration: 1500,
            isClosable: true,
            status: 'error',
          });
        });
    }
  };

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Create new Pool
        </Heading>
      </Flex>
      <Box background="white" paddingY={8} paddingX={4}>
        <CreateAllocatingIpv4PrefixPoolForm
          onFormSubmit={handleFormSubmit}
          resourceTypeId={resourceTypeId}
          allocationStrategyId={allocationStrategyId}
          possibleParentPools={possibleParentPools}
        />
      </Box>
    </>
  );
};

export default CreateAllocatingIPv4PoolPage;
