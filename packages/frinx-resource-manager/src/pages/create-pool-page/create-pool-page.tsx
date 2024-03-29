import React, { useState, VoidFunctionComponent } from 'react';
import { Client, useClient, useQuery } from 'urql';
import { Box, Flex, Heading, Progress } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
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
    resourceManager {
      CreateSetPool(input: $input) {
        pool {
          id
        }
      }
    }
  }
`;
const CREATE_NESTED_SET_POOL_MUTATION = gql`
  mutation CreateNestedSetPool($input: CreateNestedSetPoolInput!) {
    resourceManager {
      CreateNestedSetPool(input: $input) {
        pool {
          id
        }
      }
    }
  }
`;
const CREATE_SINGLETON_POOL_MUTATION = gql`
  mutation CreateSingletonPool($input: CreateSingletonPoolInput!) {
    resourceManager {
      CreateSingletonPool(input: $input) {
        pool {
          id
        }
      }
    }
  }
`;
const CREATE_NESTED_SINGLETON_POOL_MUTATION = gql`
  mutation CreateNestedSingletonPool($input: CreateNestedSingletonPoolInput!) {
    resourceManager {
      CreateNestedSingletonPool(input: $input) {
        pool {
          id
        }
      }
    }
  }
`;
const CREATE_ALLOCATING_POOL_MUTATION = gql`
  mutation CreateAllocationPool($input: CreateAllocatingPoolInput!) {
    resourceManager {
      CreateAllocatingPool(input: $input) {
        pool {
          id
        }
      }
    }
  }
`;
const CREATE_NESTED_ALLOCATING_POOL_MUTATION = gql`
  mutation CreateNestedAllocationPool($input: CreateNestedAllocatingPoolInput!) {
    resourceManager {
      CreateNestedAllocatingPool(input: $input) {
        pool {
          id
        }
      }
    }
  }
`;

const SELECT_RESOURCE_TYPES_QUERY = gql`
  query SelectResourceTypes {
    resourceManager {
      QueryResourceTypes {
        Name
        id
        Pools {
          id
          Name
        }
        PropertyTypes {
          id
          Name
        }
      }
    }
  }
`;
const SELECT_POOLS_QUERY = gql`
  query SelectPools(
    $first: Int
    $last: Int
    $before: Cursor
    $after: Cursor
    $resourceTypeId: ID
    $filterByResources: Map
  ) {
    resourceManager {
      QueryRootResourcePools(
        first: $first
        last: $last
        before: $before
        after: $after
        resourceTypeId: $resourceTypeId
        filterByResources: $filterByResources
      ) {
        edges {
          node {
            id
            Name
            PoolProperties
            ParentResource {
              id
            }
            ResourceType {
              id
              Name
              Pools {
                id
                Name
              }
              PropertyTypes {
                id
                Name
              }
            }
            Resources {
              NestedPool {
                id
              }
              Description
              Properties
              id
              ParentPool {
                id
                Name
              }
            }
          }
        }
      }
    }
  }
`;
const SELECT_ALLOCATION_STRATEGIES_QUERY = gql`
  query SelectAllocationStrategies {
    resourceManager {
      QueryAllocationStrategies {
        id
        Name
      }
    }
  }
`;

const GET_POOL_PROPERTIES_BY_ALLOC_STRATEGY = gql`
  query RequiredPoolProperties($allocationStrategyName: String!) {
    resourceManager {
      QueryRequiredPoolProperties(allocationStrategyName: $allocationStrategyName) {
        Name
        Type
        FloatVal
        IntVal
        StringVal
      }
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
  const [{ data: poolsRawData, fetching: poolsFetching }] = useQuery<SelectPoolsQuery>({ query: SELECT_POOLS_QUERY });
  const [{ data: allocStratData, fetching: allocStratFetching }] = useQuery<SelectAllocationStrategiesQuery>({
    query: SELECT_ALLOCATION_STRATEGIES_QUERY,
  });
  const [{ data, fetching }] = useQuery<SelectResourceTypesQuery>({ query: SELECT_RESOURCE_TYPES_QUERY });
  const [{ fetching: isLoadingPoolProperties, data: requiredPoolProperties }] = useQuery<
    RequiredPoolPropertiesQuery,
    RequiredPoolPropertiesQueryVariables
  >({ query: GET_POOL_PROPERTIES_BY_ALLOC_STRATEGY, variables: { allocationStrategyName: customResourceTypeName } });

  const poolsData = poolsRawData?.resourceManager.QueryRootResourcePools.edges.map((e) => {
    return e?.node;
  });

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

  const allocStrategies = allocStratData.resourceManager.QueryAllocationStrategies.map((as) => ({
    id: as.id,
    name: as.Name,
  }));

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
          resourceTypes={data.resourceManager.QueryResourceTypes}
          resourcePools={poolsRawData}
          allocStrategies={allocStrategies}
          isLoadingRequiredPoolProperties={isLoadingPoolProperties}
          onResourceTypeChange={setCustomResourceTypeName}
          requiredPoolProperties={requiredPoolProperties?.resourceManager.QueryRequiredPoolProperties}
        />
      </Box>
    </>
  );
};

export default CreatePoolPage;
