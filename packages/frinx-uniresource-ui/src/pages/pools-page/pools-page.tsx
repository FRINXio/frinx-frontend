import { Box, Button, Heading, HStack, Icon, Progress, Spacer } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import { useMinisearch, useNotifications, useTags } from '@frinx/shared/src';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetPoolsQuery,
  GetPoolsQueryVariables,
  GetResourceTypesQuery,
  GetResourceTypesQueryVariables,
} from '../../__generated__/graphql';
import PoolsTable from './pools-table';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';

const ALL_POOLS_QUERY = gql`
  query GetPools($resourceTypeId: ID) {
    QueryRootResourcePools(resourceTypeId: $resourceTypeId) {
      id
      Name
      PoolType
      Tags {
        id
        Tag
      }
      PoolProperties
      AllocationStrategy {
        id
        Name
        Lang
      }
      ResourceType {
        id
        Name
      }
      Resources {
        id
        NestedPool {
          id
          Name
        }
      }
      Capacity {
        freeCapacity
        utilizedCapacity
      }
    }
  }
`;

const DELETE_POOL_MUTATION = gql`
  mutation DeletePool($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
    }
  }
`;

const GET_RESOURCE_TYPES = gql`
  query GetResourceTypes {
    QueryResourceTypes {
      id
      Name
    }
  }
`;

const PoolsPage: VoidFunctionComponent = () => {
  const [selectedTags, { handleOnTagClick, clearAllTags }] = useTags();
  const [selectedResourceType, setSelectedResourceType] = useState<string>('');
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [{ data, fetching: isQueryLoading, error }] = useQuery<GetPoolsQuery, GetPoolsQueryVariables>({
    query: ALL_POOLS_QUERY,
    context,
  });
  const [{ data: resourceTypes }] = useQuery<GetResourceTypesQuery, GetResourceTypesQueryVariables>({
    query: GET_RESOURCE_TYPES,
  });
  const [{ fetching: isMutationLoading }, deletePool] = useMutation<
    DeletePoolMutation,
    DeletePoolMutationMutationVariables
  >(DELETE_POOL_MUTATION);
  const { addToastNotification } = useNotifications();
  const { results, searchText, setSearchText } = useMinisearch({ items: data?.QueryRootResourcePools });

  const handleDeleteBtnClick = async (id: string) => {
    try {
      const result = await deletePool({ input: { resourcePoolId: id } }, context);
      if (result.error) {
        throw Error();
      }
      addToastNotification({
        type: 'success',
        content: 'Successfully deleted resource pool',
      });
    } catch {
      addToastNotification({
        type: 'error',
        content: 'There was a problem with deletion of the resource pool',
      });
    }
  };

  const handleOnClearSearch = () => {
    setSearchText('');
    clearAllTags();
    setSelectedResourceType('');
  };

  if (isQueryLoading) {
    return <Progress isIndeterminate size="sm" mt={-10} />;
  }

  if (error != null || data == null) {
    return <div>{error?.message}</div>;
  }

  const isSelectedResourceTypeEmpty = selectedResourceType == null || selectedResourceType.trim().length === 0;

  const resourcePools = results.filter((pool) => {
    if (!isSelectedResourceTypeEmpty && selectedTags.length > 0) {
      return (
        pool.Tags.some((poolTag) => selectedTags.includes(poolTag.Tag)) && pool.ResourceType.id === selectedResourceType
      );
    }

    if (!isSelectedResourceTypeEmpty) {
      return pool.ResourceType.id === selectedResourceType;
    }

    if (selectedTags.length > 0) {
      return pool.Tags.some((poolTag) => selectedTags.includes(poolTag.Tag));
    }

    return true;
  });

  return (
    <>
      <HStack mb={5}>
        <Heading as="h1" size="lg">
          Pools
        </Heading>
        <Spacer />
        <Box marginLeft="auto">
          <Button
            mr={2}
            leftIcon={<Icon size={20} as={FeatherIcon} icon="plus" />}
            colorScheme="blue"
            as={Link}
            to="new"
          >
            Create Pool
          </Button>
        </Box>
      </HStack>
      <SearchFilterPoolsBar
        setSearchText={setSearchText}
        searchText={searchText}
        selectedTags={selectedTags}
        selectedResourceType={selectedResourceType}
        setSelectedResourceType={setSelectedResourceType}
        clearAllTags={clearAllTags}
        onTagClick={handleOnTagClick}
        onClearSearch={handleOnClearSearch}
        resourceTypes={resourceTypes?.QueryResourceTypes}
        canFilterByResourceType
      />

      <Box position="relative" marginBottom={5}>
        <Box position="absolute" top={0} left={0} right={0}>
          {data != null && (isQueryLoading || isMutationLoading) && <Progress isIndeterminate size="xs" />}
        </Box>
        <PoolsTable
          pools={resourcePools}
          isLoading={isQueryLoading || isMutationLoading}
          onDeleteBtnClick={handleDeleteBtnClick}
          onTagClick={handleOnTagClick}
        />
      </Box>
    </>
  );
};

export default PoolsPage;
