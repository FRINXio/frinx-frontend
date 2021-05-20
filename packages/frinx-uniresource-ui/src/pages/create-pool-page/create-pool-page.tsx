import React, { VoidFunctionComponent } from 'react';
import { Client, useClient, useMutation, useQuery } from 'urql';
import { Box, Flex, Heading, Spinner } from '@chakra-ui/react';
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
  SelectPoolsQuery,
  SelectResourceTypesQuery,
} from '../../__generated__/graphql';
import CreatePoolForm from '../../components/create-pool-form';

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
    }
  }
`;

type PoolType = 'set' | 'allocating' | 'singleton';
type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
  poolType: PoolType;
} & (
  | {
      poolType: 'allocating';
      dealocationSafetyPeriod: number;
      allocationStrategyId: string;
      poolProperties: Record<string, string>[];
    }
  | { poolType: 'set'; dealocationSafetyPeriod: number; poolValues: Record<string, string>[] }
  | { poolType: 'singleton'; poolValues: Record<string, string>[] }
) &
  (
    | {
        isNested: true;
        parentResourceId: string;
      }
    | { isNested: false }
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
              poolValues: [],
            },
          },
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
            },
          },
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
              poolValues: [],
            },
          },
        );
      default:
        throw new Error('should never happen');
    }
  }
  switch (values.poolType) {
    case 'set':
      return mutationFn<CreateSetPoolMutation, CreateSetPoolMutationVariables>(CREATE_SET_POOL_MUTATION, {
        input: {
          poolName: values.name,
          description: values.description,
          poolDealocationSafetyPeriod: values.dealocationSafetyPeriod,
          resourceTypeId: values.resourceTypeId,
          poolValues: [],
        },
      });
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
            poolProperties: [],
            poolPropertyTypes: [],
          },
        },
      );
    case 'singleton':
      return mutationFn<CreateSingletonPoolMutation, CreateSingletonPoolMutationVariables>(
        CREATE_SINGLETON_POOL_MUTATION,
        {
          input: {
            poolName: values.name,
            description: values.description,
            resourceTypeId: values.resourceTypeId,
            poolValues: [],
          },
        },
      );
    default:
      throw new Error('should never happen');
  }
}

const CreatePoolPage: VoidFunctionComponent<Props> = ({ onCreateSuccess }) => {
  const client = useClient();
  const [{ data: poolsData, fetching: poolsFetching }] = useQuery<SelectPoolsQuery>({ query: SELECT_POOLS_QUERY });
  const [{ data, fetching }] = useQuery<SelectResourceTypesQuery>({ query: SELECT_RESOURCE_TYPES_QUERY });

  const handleFormSubmit = (values: FormValues) => {
    console.log(values);
    return;
    createPool(client.mutation, values)
      .toPromise()
      .then(() => {
        console.log('success');
        onCreateSuccess();
      });
  };

  if (fetching || poolsFetching) {
    return <Spinner size="xl" />;
  }

  if (data == null || poolsData == null) {
    return null;
  }

  const resourceTypes = data.QueryResourceTypes.map((rt) => ({ id: rt.id, name: rt.Name }));
  const pools = poolsData.QueryResourcePools.map((p) => ({ id: p.id, name: p.Name }));

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Create new Pool
        </Heading>
      </Flex>
      <Box background="white" paddingY={8} paddingX={4}>
        <CreatePoolForm onFormSubmit={handleFormSubmit} resourceTypes={resourceTypes} pools={pools} />
      </Box>
    </>
  );
};

export default CreatePoolPage;
