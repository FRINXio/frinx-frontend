import React, { useState, VoidFunctionComponent } from 'react';
import { Client, useClient, useQuery } from 'urql';
import { Box, Flex, Heading, Progress } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import gql from 'graphql-tag';
import {
  CreateAllocationPoolMutation,
  CreateAllocationPoolMutationVariables,
  CreateNestedAllocationPoolMutation,
  CreateNestedAllocationPoolMutationVariables,
  CreateNestedSetPoolMutation,
  CreateNestedSetPoolMutationVariables,
  CreateNestedSingletonPoolMutation,
  CreateNestedSingletonPoolMutationVariables,
  CreateSetPoolMutation,
  CreateSetPoolMutationVariables,
  CreateSingletonPoolMutation,
  CreateSingletonPoolMutationVariables,
  RequiredPoolPropertiesQuery,
  RequiredPoolPropertiesQueryVariables,
  SelectAllocationStrategiesQuery,
  SelectPoolsQuery,
  SelectResourceTypesQuery,
} from '../../__generated__/graphql';
import CreatePoolForm from './create-pool-form';

const CREATE_SET_POOL_MUTATION = gql`
  mutation CreateSetPool($input: CreateSetPoolInput!) {
    CreateSetPool(input: $input) {
      pool {
        id
      }
    }
  }
`;
const CREATE_NESTED_SET_POOL_MUTATION = gql`
  mutation CreateNestedSetPool($input: CreateNestedSetPoolInput!) {
    CreateNestedSetPool(input: $input) {
      pool {
        id
      }
    }
  }
`;
const CREATE_SINGLETON_POOL_MUTATION = gql`
  mutation CreateSingletonPool($input: CreateSingletonPoolInput!) {
    CreateSingletonPool(input: $input) {
      pool {
        id
      }
    }
  }
`;
const CREATE_NESTED_SINGLETON_POOL_MUTATION = gql`
  mutation CreateNestedSingletonPool($input: CreateNestedSingletonPoolInput!) {
    CreateNestedSingletonPool(input: $input) {
      pool {
        id
      }
    }
  }
`;
const CREATE_ALLOCATING_POOL_MUTATION = gql`
  mutation CreateAllocationPool($input: CreateAllocatingPoolInput!) {
    CreateAllocatingPool(input: $input) {
      pool {
        id
      }
    }
  }
`;
const CREATE_NESTED_ALLOCATING_POOL_MUTATION = gql`
  mutation CreateNestedAllocationPool($input: CreateNestedAllocatingPoolInput!) {
    CreateNestedAllocatingPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

const SELECT_RESOURCE_TYPES_QUERY = gql`
  query SelectResourceTypes {
    QueryResourceTypes {
      Name
      id
    }
  }
`;
const SELECT_POOLS_QUERY = gql`
  query SelectPools {
    QueryResourcePools {
      id
      Name
      ResourceType {
        id
        Name
      }
      Resources {
        Description
        Properties
        id
        ParentPool {
          id
          Name
        }
        NestedPool {
          id
          PoolProperties
        }
      }
    }
  }
`;
const SELECT_ALLOCATION_STRATEGIES_QUERY = gql`
  query SelectAllocationStrategies {
    QueryAllocationStrategies {
      id
      Name
    }
  }
`;

const GET_POOL_PROPERTIES_BY_ALLOC_STRATEGY = gql`
  query RequiredPoolProperties($allocationStrategyName: String!) {
    QueryRequiredPoolProperties(allocationStrategyName: $allocationStrategyName) {
      Name
      Type
      FloatVal
      IntVal
      StringVal
    }
  }
`;

type PoolType = 'set' | 'allocating' | 'singleton';
type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
  tags: string[];
  poolType: PoolType;
} & (
  | {
      poolType: 'allocating';
      dealocationSafetyPeriod: number;
      allocationStrategyId: string;
      poolProperties: Record<string, string | number>;
      poolPropertyTypes: Record<string, 'int' | 'string'>;
    }
  | { poolType: 'set'; dealocationSafetyPeriod: number; poolValues: Record<string, string>[] }
  | { poolType: 'singleton'; poolValues: Record<string, string>[] }
) &
  (
    | {
        isNested: true;
        parentResourceId: string;
      }
    | { isNested: false; parentResourceId: undefined }
  );

type Props = {
  onCreateSuccess: () => void;
};

function createPool(mutationFn: Client['mutation'], values: FormValues): ReturnType<Client['mutation']> {
  if (values.isNested) {
    switch (values.poolType) {
      case 'set':
        return mutationFn<CreateNestedSetPoolMutation, CreateNestedSetPoolMutationVariables>(
          CREATE_NESTED_SET_POOL_MUTATION,
          {
            input: {
              parentResourceId: values.parentResourceId,
              poolDealocationSafetyPeriod: values.dealocationSafetyPeriod,
              poolName: values.name,
              description: values.description,
              resourceTypeId: values.resourceTypeId,
              poolValues: values.poolValues,
              tags: values.tags,
            },
          },
          { additionalTypenames: ['ResourcePool'] },
        );
      case 'allocating':
        return mutationFn<CreateNestedAllocationPoolMutation, CreateNestedAllocationPoolMutationVariables>(
          CREATE_NESTED_ALLOCATING_POOL_MUTATION,
          {
            input: {
              parentResourceId: values.parentResourceId,
              poolDealocationSafetyPeriod: values.dealocationSafetyPeriod,
              poolName: values.name,
              description: values.description,
              resourceTypeId: values.resourceTypeId,
              allocationStrategyId: values.allocationStrategyId,
              tags: values.tags,
            },
          },
          { additionalTypenames: ['ResourcePool'] },
        );
      case 'singleton':
        return mutationFn<CreateNestedSingletonPoolMutation, CreateNestedSingletonPoolMutationVariables>(
          CREATE_NESTED_SINGLETON_POOL_MUTATION,
          {
            input: {
              parentResourceId: values.parentResourceId,
              poolName: values.name,
              description: values.description,
              resourceTypeId: values.resourceTypeId,
              poolValues: values.poolValues,
              tags: values.tags,
            },
          },
          { additionalTypenames: ['ResourcePool'] },
        );
      default:
        throw new Error('should never happen');
    }
  }
  switch (values.poolType) {
    case 'set':
      return mutationFn<CreateSetPoolMutation, CreateSetPoolMutationVariables>(
        CREATE_SET_POOL_MUTATION,
        {
          input: {
            poolName: values.name,
            description: values.description,
            poolDealocationSafetyPeriod: values.dealocationSafetyPeriod,
            resourceTypeId: values.resourceTypeId,
            poolValues: values.poolValues,
            tags: values.tags,
          },
        },
        { additionalTypenames: ['ResourcePool'] },
      );
    case 'allocating':
      return mutationFn<CreateAllocationPoolMutation, CreateAllocationPoolMutationVariables>(
        CREATE_ALLOCATING_POOL_MUTATION,
        {
          input: {
            poolName: values.name,
            description: values.description,
            poolDealocationSafetyPeriod: values.dealocationSafetyPeriod,
            resourceTypeId: values.resourceTypeId,
            allocationStrategyId: values.allocationStrategyId,
            poolProperties: values.poolProperties,
            poolPropertyTypes: values.poolPropertyTypes,
            tags: values.tags,
          },
        },
        { additionalTypenames: ['ResourcePool'] },
      );
    case 'singleton':
      return mutationFn<CreateSingletonPoolMutation, CreateSingletonPoolMutationVariables>(
        CREATE_SINGLETON_POOL_MUTATION,
        {
          input: {
            poolName: values.name,
            description: values.description,
            resourceTypeId: values.resourceTypeId,
            poolValues: values.poolValues,
            tags: values.tags,
          },
        },
        { additionalTypenames: ['ResourcePool'] },
      );
    default:
      throw new Error('should never happen');
  }
}

const CreatePoolPage: VoidFunctionComponent<Props> = ({ onCreateSuccess }) => {
  const [customResourceTypeName, setCustomResourceTypeName] = useState('');
  const client = useClient();
  const { addToastNotification } = useNotifications();
  const [{ data: poolsData, fetching: poolsFetching }] = useQuery<SelectPoolsQuery>({ query: SELECT_POOLS_QUERY });
  const [{ data: allocStratData, fetching: allocStratFetching }] = useQuery<SelectAllocationStrategiesQuery>({
    query: SELECT_ALLOCATION_STRATEGIES_QUERY,
  });
  const [{ data, fetching }] = useQuery<SelectResourceTypesQuery>({ query: SELECT_RESOURCE_TYPES_QUERY });
  const [{ fetching: isLoadingPoolProperties, data: requiredPoolProperties }] = useQuery<
    RequiredPoolPropertiesQuery,
    RequiredPoolPropertiesQueryVariables
  >({ query: GET_POOL_PROPERTIES_BY_ALLOC_STRATEGY, variables: { allocationStrategyName: customResourceTypeName } });

  const handleFormSubmit = (values: FormValues) => {
    createPool(client.mutation.bind(client), values)
      .toPromise()
      .then((response) => {
        if (response.error) {
          throw response.error;
        }
        onCreateSuccess();
        addToastNotification({
          type: 'success',
          content: 'Successfully created resource pool',
        });
      })
      .catch((error) => {
        addToastNotification({
          type: 'error',
          content: error.message || 'There was a problem with creating of resource pool',
        });
      });
  };

  if (fetching || poolsFetching || allocStratFetching) {
    return <Progress isIndeterminate size="xs" mt={-10} />;
  }

  if (data == null || poolsData == null || allocStratData == null) {
    return null;
  }

  const allocStrategies = allocStratData.QueryAllocationStrategies.map((as) => ({ id: as.id, name: as.Name }));

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="xl">
          Create new Pool
        </Heading>
      </Flex>
      <Box background="white" paddingY={8} paddingX={4}>
        <CreatePoolForm
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onFormSubmit={handleFormSubmit}
          resourceTypes={data.QueryResourceTypes}
          resourcePools={poolsData}
          allocStrategies={allocStrategies}
          isLoadingRequiredPoolProperties={isLoadingPoolProperties}
          onResourceTypeChange={setCustomResourceTypeName}
          requiredPoolProperties={requiredPoolProperties?.QueryRequiredPoolProperties}
        />
      </Box>
    </>
  );
};

export default CreatePoolPage;