import { Flex, Heading, Box, useToast, Spinner } from '@chakra-ui/react';
import gql from 'graphql-tag';
import React, { FC } from 'react';
import { useMutation, useQuery } from 'urql';
import CreateAllocatingVlanPoolForm from './create-allocating-vlan-pool-form';

import {
  GetVlanParentPoolsQuery,
  GetVlanResourceTypeQuery,
  GetVlanAllocationStrategyQuery,
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
  query GetVlanAllocationStrategy {
    QueryAllocationStrategies(byName: "vlan") {
      Name
      id
    }
  }
`;

const RESOURCE_TYPE_QUERY = gql`
  query GetVlanResourceType {
    QueryResourceTypes(byName: "vlan") {
      Name
      id
    }
  }
`;

const POSSIBLE_PARENT_POOLS_QUERY = gql`
  query GetVlanParentPools {
    QueryResourcePools {
      id
      Name
      ResourceType {
        id
      }
    }
  }
`;

const getParentPools = (parentPools: GetVlanParentPoolsQuery | undefined, resourceTypeId: string): Pool[] | null => {
  if (parentPools) {
    return parentPools.QueryResourcePools.map((pool) => {
      return {
        name: pool.Name,
        id: pool.id,
        resourceTypeId: pool.ResourceType.id,
      };
    }).filter((pool) => pool.resourceTypeId === resourceTypeId);
  }

  return null;
};

type FormValues = {
  poolName: string;
  dealocationSafetyPeriod: number;
  allocationStrategyId: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int'>;
};

type Props = {
  onCreateSuccess: () => void;
};

type Pool = {
  id: string;
  name: string;
  resourceTypeId: string;
};

const CreateAllocatingVlanPoolPage: FC<Props> = ({ onCreateSuccess }) => {
  const toast = useToast();
  const [, createPool] = useMutation(CREATE_ALLOCATING_POOL_MUTATION);

  const [{ data: resourceTypeData, fetching: resourceTypeFetching }] = useQuery<GetVlanResourceTypeQuery>({
    query: RESOURCE_TYPE_QUERY,
  });
  const [{ data: allocationStrategy, fetching: allocationStrategyFetching }] = useQuery<GetVlanAllocationStrategyQuery>(
    {
      query: ALLOCATION_STRATEGY_QUERY,
    },
  );
  const [result] = useQuery<GetVlanParentPoolsQuery>({
    query: POSSIBLE_PARENT_POOLS_QUERY,
  });

  const { data: parentPools, fetching: possibleParentPoolsFetching } = result;

  if (resourceTypeFetching || allocationStrategyFetching || possibleParentPoolsFetching) {
    return <Spinner variant="xl" />;
  }

  if (resourceTypeData == null || allocationStrategy == null) {
    return null;
  }

  const resourceTypeId = resourceTypeData.QueryResourceTypes[0].id;
  const allocationStrategyId = allocationStrategy.QueryAllocationStrategies[0].id;
  const possibleParentPools = getParentPools(parentPools, resourceTypeId);

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
