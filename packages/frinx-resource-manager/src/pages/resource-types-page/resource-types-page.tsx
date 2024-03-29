import { Flex, Heading, Progress, Text } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
import gql from 'graphql-tag';
import React, { useMemo, VoidFunctionComponent, useCallback } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  DeleteResourceTypeMutation,
  DeleteResourceTypeMutationVariables,
  ResourceTypesQuery,
  DeleteStrategyMutation,
  DeleteStrategyMutationVariables,
  QueryAllocationStrategiesQuery,
} from '../../__generated__/graphql';
import ResourceTypesTable from './resource-types-table';

const RESOURCE_TYPES_QUERY = gql`
  query ResourceTypes {
    resourceManager {
      QueryResourceTypes {
        id
        Name
      }
    }
  }
`;

const DELETE_RESOURCE_TYPE_MUTATION = gql`
  mutation DeleteResourceType($input: DeleteResourceTypeInput!) {
    resourceManager {
      DeleteResourceType(input: $input) {
        resourceTypeId
      }
    }
  }
`;

const DELETE_STRATEGY_MUTATION = gql`
  mutation DeleteStrategy($input: DeleteAllocationStrategyInput!) {
    resourceManager {
      DeleteAllocationStrategy(input: $input) {
        strategy {
          id
        }
      }
    }
  }
`;

const STRATEGIES_QUERY = gql`
  query GetAllocationStrategies {
    resourceManager {
      QueryAllocationStrategies {
        id
        Name
      }
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

  const [{ data: strategies }] = useQuery<QueryAllocationStrategiesQuery>({
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
    const typeById = data?.resourceManager.QueryResourceTypes.find((type) => type.id === id)?.Name;
    const strategyId = strategies?.resourceManager.QueryAllocationStrategies.find(
      (strategy) => strategy.Name === typeById,
    );
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
      <ResourceTypesTable resourceTypes={data.resourceManager.QueryResourceTypes} onDelete={handleOnDelete} />
    </>
  );
};

export default ResourceTypesPage;
