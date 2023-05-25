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
  GetAllPoolsQuery,
  GetAllPoolsQueryVariables,
  GetResourceTypesQuery,
  GetResourceTypesQueryVariables,
  Scalars,
} from '../../__generated__/graphql';
import PoolsTable from './pools-table';
import { usePagination as graphlUsePagination } from '../../hooks/use-pagination';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import Pagination from '../../components/pagination';

const ALL_POOLS_QUERY = gql`
  query GetAllPools(
    $first: Int
    $last: Int
    $before: Cursor
    $after: Cursor
    $resourceTypeId: ID
    $filterByResources: Map
  ) {
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
          PoolType
          ParentResource {
            id
          }
          allocatedResources {
            totalCount
          }
          Tags {
            id
            Tag
          }
          PoolProperties
          AllocationStrategy {
            id
            Name
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
      pageInfo {
        endCursor {
          ID
        }
        hasNextPage
        hasPreviousPage
        startCursor {
          ID
        }
      }
      totalCount
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
  const [selectedResourceType, setSelectedResourceType] = useState<Scalars['Map']>();
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [paginationArgs, { nextPage, previousPage }] = graphlUsePagination();

  const [{ data, fetching: isQueryLoading, error }] = useQuery<GetAllPoolsQuery, GetAllPoolsQueryVariables>({
    query: ALL_POOLS_QUERY,
    variables: {
      ...(paginationArgs?.first !== null && { first: paginationArgs.first }),
      ...(paginationArgs?.last !== null && { last: paginationArgs.last }),
      ...(paginationArgs?.after !== null && { after: paginationArgs.after }),
      ...(paginationArgs?.before !== null && { before: paginationArgs.before }),
      filterByResources: selectedResourceType,
    },
    context,
  });
  const [{ data: resourceTypes }] = useQuery<GetResourceTypesQuery, GetResourceTypesQueryVariables>({
    query: GET_RESOURCE_TYPES,
  });
  const [{ fetching: isMutationLoading }, deletePool] = useMutation<
    DeletePoolMutation,
    DeletePoolMutationMutationVariables
  >(DELETE_POOL_MUTATION);

  
    const filteredPools = (data?.QueryRootResourcePools.edges ?? [])?.map((e) => {
      return e?.node
    });
  

  const { addToastNotification } = useNotifications();
  const { results, searchText, setSearchText } = useMinisearch({
    items: filteredPools,
  });

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

  const handleOnStrategyClick = (id?: string) => {
    if (id != null) {
      setSelectedResourceType(id);
    }
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
        <Heading as="h1" size="xl">
          Pools
        </Heading>
        <Spacer />
        <Box marginLeft="auto">
          <Button
            data-cy="create-pool-btn"
            mr={2}
            leftIcon={<Icon size={20} as={FeatherIcon} icon="plus" />}
            colorScheme="blue"
            as={Link}
            to="new?type=default"
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
          onStrategyClick={handleOnStrategyClick}
        />
      </Box>
      {data && (
        <Box marginTop={4} paddingX={4}>
          <Pagination
            onPrevious={previousPage(
              data.QueryRootResourcePools.pageInfo.startCursor && data.QueryRootResourcePools.pageInfo.startCursor.ID,
            )}
            onNext={nextPage(
              data.QueryRootResourcePools.pageInfo.endCursor && data.QueryRootResourcePools.pageInfo.endCursor.ID,
            )}
            hasNextPage={data.QueryRootResourcePools.pageInfo.hasNextPage}
            hasPreviousPage={data.QueryRootResourcePools.pageInfo.hasPreviousPage}
          />
        </Box>
      )}
    </>
  );
};

export default PoolsPage;
