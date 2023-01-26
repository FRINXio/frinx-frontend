import { Flex, Heading, Progress, Text } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
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
  query QueryAllocationStrategies {
    QueryAllocationStrategies {
      id
      Name
      Lang
      Script
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
  const [, createResourceType] = useMutation<CreateResourceTypeMutation, CreateResourceTypeMutationVariables>(
    CREATE_RESOURCE_TYPE_MUTATION,
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
            notification.addToastNotification({
              content: response.error.message,
              type: 'error',
            });
          } else {
            notification.addToastNotification({
              title: 'Success',
              content: 'Strategy deleted',
              type: 'success',
            });
          }
        })
        .catch((err) => {
          notification.addToastNotification({
            content: err.message,
            type: 'error',
          });
        });
    },
    [deleteStrategy, notification],
  );

  const handleOnCreate = (resourceTypeName: string) => {
    createResourceType(
      {
        input: {
          resourceName: resourceTypeName,
          resourceProperties: {},
        },
      },
      ctx,
    )
      .then(({ error: createResourceTypeError }) => {
        if (createResourceTypeError != null) {
          throw Error();
        }

        notification.addToastNotification({ content: 'Resource type created successfully', type: 'success' });
      })
      .catch(() => notification.addToastNotification({ content: 'Resource type creation failed', type: 'error' }));
  };

  const handleOnDelete = (resourceTypeId: string) => {
    deleteResourceType({ input: { resourceTypeId } }, ctx)
      .then(({ error: deleteResourceTypeError }) => {
        if (deleteResourceTypeError != null) {
          throw Error();
        }

        notification.addToastNotification({ content: 'Resource type deleted successfully', type: 'success' });
      })
      .catch(() => notification.addToastNotification({ content: 'Resource type deletion failed', type: 'error' }));
    const strategyId = findStrategyId(resourceTypeId);
    deleteStrategyById(strategyId || '');
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
