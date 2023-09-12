import { Box, Button, Flex, Heading, HStack, Icon, Progress, Spacer } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import {
  omitNullValue,
  useMinisearch,
  useNotifications,
  useTags,
  SelectItemsPerPage,
  usePagination,
  Pagination,
} from '@frinx/shared';
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
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';

type InputValues = { [key: string]: string };

type PoolsFilter =
  | {
      resources: InputValues | null;
      resourceType: string | null;
    }
  | Record<string, string>;

const ALL_POOLS_QUERY = gql`
  query GetAllPools(
    $first: Int
    $last: Int
    $before: Cursor
    $after: Cursor
    $resourceTypeId: ID
    $filterByResources: Map
    $tags: TagOr
  ) {
    QueryRootResourcePools(
      first: $first
      last: $last
      before: $before
      after: $after
      resourceTypeId: $resourceTypeId
      filterByResources: $filterByResources
      tags: $tags
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
            Properties
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
  const [poolsFilter, setPoolsFilter] = useState<PoolsFilter>({ resources: null, resourceType: null });
  const [allocatedResources, setAllocatedResources] = useState<InputValues>({});
  const [selectedResourceType, setSelectedResourceType] = useState<Scalars['Map']>();
  const [searchName, setSearchName] = useState<string>('');
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [paginationArgs, { nextPage, previousPage, setItemsCount, firstPage }] = usePagination();

  const [{ data, fetching: isQueryLoading, error }] = useQuery<GetAllPoolsQuery, GetAllPoolsQueryVariables>({
    query: ALL_POOLS_QUERY,
    variables: {
      ...(paginationArgs?.first !== null && { first: paginationArgs.first }),
      ...(paginationArgs?.last !== null && { last: paginationArgs.last }),
      ...(paginationArgs?.after !== null && { after: paginationArgs.after }),
      ...(paginationArgs?.before !== null && { before: paginationArgs.before }),
      filterByResources: poolsFilter.resources ?? null,
      tags: selectedTags.length ? { matchesAny: [{ matchesAll: selectedTags }] } : null,
      resourceTypeId: poolsFilter.resourceType || null,
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

  const filteredPools = (data?.QueryRootResourcePools.edges ?? [])
    ?.map((e) => {
      return e?.node ?? null;
    })
    .filter(omitNullValue);
  const { results, setSearchText } = useMinisearch({
    items: filteredPools,
  });

  const onSearchClick = () => {
    if (Object.keys(allocatedResources).length) {
      setPoolsFilter({
        resources: allocatedResources,
        resourceType: selectedResourceType,
      });
    }
    if (!Object.keys(allocatedResources).length) {
      setPoolsFilter({
        resourceType: selectedResourceType,
      });
    }
    setSearchText(searchName);
    firstPage();
  };

  const { addToastNotification } = useNotifications();

  const handleDeleteBtnClick = (id: string) => {
    deletePool({ input: { resourcePoolId: id } }, context)
      .then((res) => {
        if (!res.error) {
          addToastNotification({
            content: 'Pool deleted successfuly',
            title: 'Success',
            type: 'success',
          });
        }
      })
      .catch((err) => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: err?.message,
        });
      });
  };

  const handleOnClearSearch = () => {
    setSearchText('');
    clearAllTags();
    setSelectedResourceType('');
    setPoolsFilter({});
  };

  const handleOnStrategyClick = (id?: string) => {
    if (id != null) {
      setSelectedResourceType(id);
    }
  };

  if (error != null || data == null) {
    return <div>{error?.message}</div>;
  }

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
        searchName={searchName}
        setSearchName={setSearchName}
        onSearchClick={onSearchClick}
        allocatedResources={allocatedResources}
        setAllocatedResources={setAllocatedResources}
        selectedTags={selectedTags}
        selectedResourceType={selectedResourceType}
        setSelectedResourceType={setSelectedResourceType}
        clearAllTags={clearAllTags}
        onTagClick={handleOnTagClick}
        onClearSearch={handleOnClearSearch}
        resourceTypes={resourceTypes?.QueryResourceTypes}
        canFilterByResourceType
        canFilterByAllocatedResources
      />

      <Box position="relative" marginBottom={5}>
        <Box position="absolute" top={0} left={0} right={0}>
          {data != null && (isQueryLoading || isMutationLoading) && <Progress isIndeterminate size="xs" />}
        </Box>
        <PoolsTable
          pools={results}
          isLoading={isQueryLoading || isMutationLoading}
          onDeleteBtnClick={handleDeleteBtnClick}
          onTagClick={handleOnTagClick}
          onStrategyClick={handleOnStrategyClick}
        />
      </Box>
      <Flex align="center" justify="space-between">
        {data && data.QueryRootResourcePools.pageInfo.startCursor && data.QueryRootResourcePools.pageInfo.endCursor && (
          <Box mt={4} px={4}>
            <Pagination
              onPrevious={previousPage(data.QueryRootResourcePools.pageInfo.startCursor.toString())}
              onNext={nextPage(data.QueryRootResourcePools.pageInfo.endCursor.toString())}
              hasNextPage={data.QueryRootResourcePools.pageInfo.hasNextPage}
              hasPreviousPage={data.QueryRootResourcePools.pageInfo.hasPreviousPage}
            />
          </Box>
        )}
        <SelectItemsPerPage
          first={paginationArgs.first}
          onItemsPerPageChange={firstPage}
          last={paginationArgs.last}
          setItemsCount={setItemsCount}
        />
      </Flex>
    </>
  );
};

export default PoolsPage;
