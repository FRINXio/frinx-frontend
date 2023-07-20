import { Flex, Heading, Progress, Text } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import gql from 'graphql-tag';
import React, { useCallback, useMemo, VoidFunctionComponent } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  AllocationStrategiesQuery,
  DeleteResourceTypeMutation,
  DeleteResourceTypeMutationVariables,
  DeleteStrategyMutation,
  DeleteStrategyMutationVariables,
  ResourceTypesQuery,
} from '../../__generated__/graphql';
import ResourceTypesTable from './resource-types-table';

const RESOURCE_TYPES_QUERY = gql`
  query ResourceTypes {
    QueryResourceTypes {
      id
      Name
    }
  }
`;

const DELETE_RESOURCE_TYPE_MUTATION = gql`
  mutation DeleteResourceType($input: DeleteResourceTypeInput!) {
    DeleteResourceType(input: $input) {
      resourceTypeId
    }
  }
`;

const DELETE_STRATEGY_MUTATION = gql`
  mutation DeleteStrategy($input: DeleteAllocationStrategyInput!) {
    DeleteAllocationStrategy(input: $input) {
      strategy {
        id
      }
    }
  }
`;

const STRATEGIES_QUERY = gql`
  query AllocationStrategies {
    QueryAllocationStrategies {
      id
      Name
    }
  }
`;

const ResourceTypesPage: VoidFunctionComponent = () => {
  const ctx = useMemo(
    () => ({
      additionalTypenames: ['ResourceType'],
    }),
    [],
  );
  const notification = useNotifications();

  const [{ data, fetching, error }] = useQuery<ResourceTypesQuery>({
    query: RESOURCE_TYPES_QUERY,
    context: ctx,
  });

  const [{ data: strategies }] = useQuery<AllocationStrategiesQuery>({
    query: STRATEGIES_QUERY,
    context: ctx,
  });

  const [, deleteResourceType] = useMutation<DeleteResourceTypeMutation, DeleteResourceTypeMutationVariables>(
    DELETE_RESOURCE_TYPE_MUTATION,
  );

  const [, deleteStrategy] = useMutation<DeleteStrategyMutation, DeleteStrategyMutationVariables>(
    DELETE_STRATEGY_MUTATION,
  );

  const findStrategyId = (id: string) => {
    const typeById = data?.QueryResourceTypes.find((type) => type.id === id)?.Name;
    const strategyId = strategies?.QueryAllocationStrategies.find((strategy) => strategy.Name === typeById);
    return strategyId?.id;
  };

  const deleteStrategyById = useCallback(
    (id: string) => {
      deleteStrategy(
        {
          input: { allocationStrategyId: id },
        },
        { additionalTypenames: ['AllocationStrategy'] },
      )
        .then((response) => {
          if (response.error) {
            throw Error(response.error.message);
          }
          notification.addToastNotification({ content: 'Strategy deleted successfully', type: 'success' });
        })
        .catch(() => {
          notification.addToastNotification({
            content: 'There was a problem with strategy deletion',
            type: 'error',
          });
        });
    },
    [deleteStrategy, notification],
  );

  const handleOnDelete = (resourceTypeId: string) => {
    deleteResourceType({ input: { resourceTypeId } }, ctx)
      .then(({ error: deleteResourceTypeError }) => {
        if (deleteResourceTypeError != null) {
          throw Error();
        }

        notification.addToastNotification({ content: 'Resource type deleted successfully', type: 'success' });
        const strategyId = findStrategyId(resourceTypeId);
        deleteStrategyById(strategyId || '');
      })
      .catch(() => notification.addToastNotification({ content: 'Resource type deletion failed', type: 'error' }));
  };

  if (fetching) {
    return <Progress isIndeterminate size="sm" mt={-10} />;
  }

  if (error || !data) {
    return error == null ? <Text>No data returned from query.</Text> : <Text>Error: {error.message}</Text>;
  }

  return (
    <>
      <Flex marginBottom={5} alignItems="center">
        <Heading as="h1" size="xl">
          Resource Types
        </Heading>
      </Flex>
      <ResourceTypesTable resourceTypes={data.QueryResourceTypes} onDelete={handleOnDelete} />
    </>
  );
};

export default ResourceTypesPage;
