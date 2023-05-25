import { Box, Button, Flex, Heading, Icon, Progress } from '@chakra-ui/react';
import { useMinisearch, useNotifications, useTags } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import Pagination from '../../components/pagination';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import { usePagination } from '../../hooks/use-pagination';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetAllIpPoolsQuery,
  GetAllIpPoolsQueryVariables,
  GetResourceTypesQuery,
  GetResourceTypesQueryVariables,
} from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';

const POOLS_QUERY = gql`
  query GetAllIPPools(
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
  const [selectedResourceType, setSelectedResourceType] = React.useState<string>('');
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data, fetching: isQueryLoading, error }] = useQuery<GetAllIpPoolsQuery, GetAllIpPoolsQueryVariables>({
    query: POOLS_QUERY,
    variables: {
      ...(paginationArgs?.first !== null && { first: paginationArgs.first }),
      ...(paginationArgs?.last !== null && { last: paginationArgs.last }),
      ...(paginationArgs?.after !== null && { after: paginationArgs.after }),
      ...(paginationArgs?.before !== null && { before: paginationArgs.before }),
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

  const allResourcePools = data?.QueryRootResourcePools.edges?.map((e) => {
    return e?.node
  });

  const filteredResourcePools = allResourcePools?.filter(
    (pool) => pool?.ResourceType.Name === 'ipv4_prefix' || pool?.ResourceType.Name === 'ipv6_prefix',
  );

  const { addToastNotification } = useNotifications();
  const { searchText, setSearchText, results } = useMinisearch({
    items: filteredResourcePools,
  });
  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();

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
  };

  if (error != null || data == null) {
    return <div>{error?.message}</div>;
  }

  if (isQueryLoading) {
    return <Progress isIndeterminate size="lg" />;
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
          setSearchText={setSearchText}
          searchText={searchText}
          selectedTags={selectedTags}
          clearAllTags={clearAllTags}
          onTagClick={handleOnTagClick}
          onClearSearch={handleOnClearSearch}
          canFilterByResourceType
          resourceTypes={resourceTypes?.QueryResourceTypes}
          selectedResourceType={selectedResourceType}
          setSelectedResourceType={handleOnStrategyClick}
        />
        <PoolsTable
          pools={ipPools}
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

export default IpamPoolPage;
