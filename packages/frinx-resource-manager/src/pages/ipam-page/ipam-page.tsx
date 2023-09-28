import { Box, Button, Flex, Heading, Icon, Progress } from '@chakra-ui/react';
import {
  omitNullValue,
  useMinisearch,
  useNotifications,
  useTags,
  SelectItemsPerPage,
  Pagination,
  usePagination,
} from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import Ipv46PrefixSwitch from '../../components/ipv46-prefix-switch';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetAllIpPoolsQuery,
  GetAllIpPoolsQueryVariables,
  GetResourceTypesQuery,
  GetResourceTypesQueryVariables,
} from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';

type InputValues = { [key: string]: string };

type PoolsFilter =
  | {
      resources: InputValues | null;
      resourceType: string | null;
    }
  | Record<string, string>;

const POOLS_QUERY = gql`
  query GetAllIPPools(
    $first: Int
    $last: Int
    $before: Cursor
    $after: Cursor
    $resourceTypeId: ID
    $filterByResources: Map
    $tags: TagOr
    $sortBy: SortResourcePoolsInput
  ) {
    QueryRootResourcePools(
      first: $first
      last: $last
      before: $before
      after: $after
      resourceTypeId: $resourceTypeId
      filterByResources: $filterByResources
      tags: $tags
      sortBy: $sortBy
    ) {
      edges {
        node {
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
            Script
          }
          ResourceType {
            id
            Name
          }
          allocatedResources {
            totalCount
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

const IpamPoolPage: VoidFunctionComponent = () => {
  const [poolsFilter, setPoolsFilter] = useState<PoolsFilter>({ resources: null, resourceType: null });
  const [isIpv4, setIsIpv4] = useState<boolean>(true);
  const [selectedResourceType, setSelectedResourceType] = useState<string>('');
  const [allocatedResources, setAllocatedResources] = useState<Record<string, string>>({});
  const [searchName, setSearchName] = useState<string>('');
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [paginationArgs, { nextPage, previousPage, firstPage, setItemsCount }] = usePagination();
  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();

  const ipv4PrefixId = '25769803776';
  const ipv6PrefixId = '25769803780';

  const [{ data, fetching: isQueryLoading, error }] = useQuery<GetAllIpPoolsQuery, GetAllIpPoolsQueryVariables>({
    query: POOLS_QUERY,
    variables: {
      ...(paginationArgs?.first !== null && { first: paginationArgs.first }),
      ...(paginationArgs?.last !== null && { last: paginationArgs.last }),
      ...(paginationArgs?.after !== null && { after: paginationArgs.after }),
      ...(paginationArgs?.before !== null && { before: paginationArgs.before }),
      filterByResources: poolsFilter.resources ?? null,
      tags: { matchesAny: [{ matchesAll: selectedTags }] },
      resourceTypeId: isIpv4 ? ipv4PrefixId : ipv6PrefixId,
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

  const allResourcePools = (data?.QueryRootResourcePools.edges ?? [])
    ?.map((e) => {
      return e?.node ?? null;
    })
    .filter(omitNullValue);

  const { setSearchText, results } = useMinisearch({
    items: allResourcePools,
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

  const handleOnStrategyClick = (id?: string) => {
    if (id != null) {
      setSelectedResourceType(id);
    }
  };

  const handleOnClearSearch = () => {
    setSearchText('');
    setSelectedResourceType('');
    clearAllTags();
    setAllocatedResources({});
    setPoolsFilter({});
    firstPage();
  };

  if (error != null || data == null) {
    return <div>{error?.message}</div>;
  }

  const ipPools = results.filter((pool) =>
    selectedTags.length > 0 ? pool.Tags.some(({ Tag }) => selectedTags.includes(Tag)) : true,
  );

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="xl">
          Pools
        </Heading>
        <Box marginLeft="auto">
          <Button
            data-cy="create-pool-btn"
            mr={2}
            leftIcon={<Icon size={20} as={FeatherIcon} icon="plus" />}
            colorScheme="blue"
            as={Link}
            to="/resource-manager/pools/new?resource-type-name=ipv4_prefix&type=ip"
          >
            Create Pool
          </Button>
        </Box>
      </Flex>
      <Box position="relative" marginBottom={5}>
        <Box position="absolute" top={0} left={0} right={0}>
          {data != null && (isQueryLoading || isMutationLoading) && <Progress isIndeterminate size="xs" />}
        </Box>
        <SearchFilterPoolsBar
          onSearchClick={onSearchClick}
          searchName={searchName}
          setSearchName={setSearchName}
          allocatedResources={allocatedResources}
          setAllocatedResources={setAllocatedResources}
          selectedTags={selectedTags}
          clearAllTags={clearAllTags}
          onTagClick={handleOnTagClick}
          onClearSearch={handleOnClearSearch}
          resourceTypes={resourceTypes?.QueryResourceTypes}
          selectedResourceType={selectedResourceType}
          setSelectedResourceType={handleOnStrategyClick}
          canFilterByAllocatedResources
        />
        <Ipv46PrefixSwitch isIpv4={isIpv4} setIsIpv4={setIsIpv4} clearAllTags={clearAllTags} firstPage={firstPage} />
        <PoolsTable
          pools={ipPools}
          isLoading={isQueryLoading || isMutationLoading}
          onDeleteBtnClick={handleDeleteBtnClick}
          onTagClick={handleOnTagClick}
          onStrategyClick={handleOnStrategyClick}
        />
      </Box>
      <Flex align="center" justify="space-between">
        {data && data.QueryRootResourcePools.pageInfo.startCursor && data.QueryRootResourcePools.pageInfo.endCursor && (
          <Box marginTop={4} paddingX={4}>
            <Pagination
              onPrevious={previousPage(data.QueryRootResourcePools.pageInfo.startCursor.toString())}
              onNext={nextPage(data.QueryRootResourcePools.pageInfo.endCursor.toString())}
              hasNextPage={data.QueryRootResourcePools.pageInfo.hasNextPage}
              hasPreviousPage={data.QueryRootResourcePools.pageInfo.hasPreviousPage}
            />
          </Box>
        )}
        <SelectItemsPerPage
          onItemsPerPageChange={firstPage}
          first={paginationArgs.first}
          last={paginationArgs.last}
          setItemsCount={setItemsCount}
        />
      </Flex>
    </>
  );
};

export default IpamPoolPage;
