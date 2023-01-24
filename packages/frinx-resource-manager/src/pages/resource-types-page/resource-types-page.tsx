import { Flex, Heading, Progress, Text } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import gql from 'graphql-tag';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  DeleteResourceTypeMutation,
  DeleteResourceTypeMutationVariables,
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

  const [, deleteResourceType] = useMutation<DeleteResourceTypeMutation, DeleteResourceTypeMutationVariables>(
    DELETE_RESOURCE_TYPE_MUTATION,
  );

  const handleOnDelete = (resourceTypeId: string) => {
    deleteResourceType({ input: { resourceTypeId } }, ctx)
      .then(({ error: deleteResourceTypeError }) => {
        if (deleteResourceTypeError != null) {
          throw Error();
        }

        notification.addToastNotification({ content: 'Resource type deleted successfully', type: 'success' });
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
