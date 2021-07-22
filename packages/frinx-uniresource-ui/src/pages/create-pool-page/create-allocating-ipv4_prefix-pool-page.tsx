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

type FormValues = {
  poolName: string;
  dealocationSafetyPeriod: number;
  allocationStrategyId: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int' | 'string'>;
};

type Props = {
  onCreateSuccess: () => void;
};

type Pool = {
  id: string;
  name: string;
  resourceTypeId: string;
};

const CreateAllocatingIPv4PoolPage: FC<Props> = ({ onCreateSuccess }) => {
  let possibleParentPools: Pool[] | null = null;
  const toast = useToast();
  const [, createPool] = useMutation(CREATE_ALLOCATING_POOL_MUTATION);

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

  if (parentPools != null) {
    const pools = parentPools.QueryResourcePools.map((pool) => {
      return {
        name: pool.Name,
        id: pool.id,
        resourceTypeId: pool.ResourceType.id,
      };
    }).filter((pool) => pool.resourceTypeId === resourceTypeId);

    possibleParentPools = !isEmpty(pools) ? pools : null;
  }

  const handleFormSubmit = (data: FormValues) => {
    createPool(data)
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
