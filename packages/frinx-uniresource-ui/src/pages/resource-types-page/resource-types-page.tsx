import { Button, Flex, Heading, Progress, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import gql from 'graphql-tag';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  CreateResourceTypeMutation,
  CreateResourceTypeMutationVariables,
  DeleteResourceTypeMutation,
  DeleteResourceTypeMutationVariables,
  ResourceTypesQuery,
} from '../../__generated__/graphql';
import CreateResourceTypeModal from './create-resource-type-modal';
import ResourceTypesTable from './resource-types-table';

const RESOURCE_TYPES_QUERY = gql`
  query ResourceTypes {
    QueryResourceTypes {
      id
      Name
    }
  }
`;

const CREATE_RESOURCE_TYPE_MUTATION = gql`
  mutation CreateResourceType($input: CreateResourceTypeInput!) {
    CreateResourceType(input: $input) {
      resourceType {
        Name
      }
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
  const { isOpen, onClose, onOpen } = useDisclosure();
  const notification = useNotifications();

  const [{ data, fetching, error }] = useQuery<ResourceTypesQuery>({
    query: RESOURCE_TYPES_QUERY,
    context: ctx,
  });

  const [, deleteResourceType] = useMutation<DeleteResourceTypeMutation, DeleteResourceTypeMutationVariables>(
    DELETE_RESOURCE_TYPE_MUTATION,
  );
  const [, createResourceType] = useMutation<CreateResourceTypeMutation, CreateResourceTypeMutationVariables>(
    CREATE_RESOURCE_TYPE_MUTATION,
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
  };

  if (fetching) {
    return <Progress isIndeterminate size="sm" mt={-10} />;
  }

  if (error || !data) {
    return error == null ? <Text>No data returned from query.</Text> : <Text>Error: {error.message}</Text>;
  }

  return (
    <>
      <CreateResourceTypeModal isOpen={isOpen} onClose={onClose} onCreate={handleOnCreate} />
      <Flex marginBottom={5} alignItems="center">
        <Heading as="h1" size="xl">
          Resource Types
        </Heading>
        <Spacer />
        <Button colorScheme="blue" onClick={onOpen}>
          Create resource type
        </Button>
      </Flex>
      <ResourceTypesTable resourceTypes={data.QueryResourceTypes} onDelete={handleOnDelete} />
    </>
  );
};

export default ResourceTypesPage;