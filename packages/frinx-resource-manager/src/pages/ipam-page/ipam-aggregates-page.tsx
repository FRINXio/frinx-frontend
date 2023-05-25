import { Box, Heading, Progress, Text } from '@chakra-ui/react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import ipaddr from 'ipaddr.js';
import { useMinisearch, useTags, useNotifications } from '@frinx/shared/src';
import {
  DeleteIpPoolMutation,
  DeleteIpPoolMutationVariables,
  GetPoolIpRangesQuery,
  GetPoolIpRangesQueryVariables,
} from '../../__generated__/graphql';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import AggregatesTable from './aggregates-table';
import Pagination from '../../components/pagination';
import { usePagination } from '../../hooks/use-pagination';

const GET_IP_POOLS = gql`
  query GetPoolIpRanges(
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
          Tags {
            id
            Tag
          }
          ResourceType {
            id
            Name
          }
          PoolProperties
          Resources {
            id
            NestedPool {
              id
              ResourceType {
                id
                Name
              }
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
  mutation DeleteIpPool($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
    }
  }
`;

const isIpv4 = (name: string) => name === 'ipv4_prefix';

const IpamAggregatesPage: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
      const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data, fetching, error }] = useQuery<GetPoolIpRangesQuery, GetPoolIpRangesQueryVariables>({
    query: GET_IP_POOLS,
    variables: {
      ...(paginationArgs?.first !== null && { first: paginationArgs.first }),
      ...(paginationArgs?.last !== null && { last: paginationArgs.last }),
      ...(paginationArgs?.after !== null && { after: paginationArgs.after }),
      ...(paginationArgs?.before !== null && { before: paginationArgs.before }),
    },
    context,
  });
  const [, deletePoolMutation] = useMutation<DeleteIpPoolMutation, DeleteIpPoolMutationVariables>(DELETE_POOL_MUTATION);

    const allAggregates = data?.QueryRootResourcePools.edges.map((e) => {
      return e?.node;
    });

  const { addToastNotification } = useNotifications();
  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();
  const { results, searchText, setSearchText } = useMinisearch({
    items: allAggregates,
    searchFields: ['PoolProperties'],
    extractField: (document, fieldName) => {
      if (fieldName === 'PoolProperties') {
        return JSON.stringify(document[fieldName]);
      }

      return document[fieldName];
    },
  });

  const handleOnClearSearch = () => {
    setSearchText('');
    clearAllTags();
  };

  const handleOnDeletePool = (poolId: string) => {
    deletePoolMutation(
      {
        input: {
          resourcePoolId: poolId,
        },
      },
      context,
    )
      .then(({ error: deletePoolError }) => {
        if (deletePoolError) {
          throw deletePoolError;
        }

        addToastNotification({
          content: 'Pool deleted successfully',
          type: 'success',
        });
      })
      .catch((err) =>
        addToastNotification({
          content: err.message,
          type: 'error',
        }),
      );
  };

  if (fetching) {
    return <Progress isIndeterminate size="sm" mt={-10} />;
  }

  if (error != null) {
    return <Text>No aggregates exists</Text>;
  }

  const aggregates = results
    .filter(
      (aggregate) => aggregate.ResourceType.Name === 'ipv4_prefix' || aggregate.ResourceType.Name === 'ipv6_prefix',
    )
    .map((aggregate) => {
      const { address, prefix } = aggregate.PoolProperties;

      const aggregateInfo = isIpv4(aggregate.ResourceType.Name)
        ? `${ipaddr.IPv4.networkAddressFromCIDR(`${address}/${prefix}`)}/${prefix}`
        : `${ipaddr.IPv6.networkAddressFromCIDR(`${address}/${prefix}`)}/${prefix}`;
      return {
        id: aggregate.id,
        aggregate: aggregateInfo,
        prefixes: aggregate.Resources.filter((resource) => resource.NestedPool != null).length,
        freeCapacity: aggregate.Capacity?.freeCapacity,
        utilizedCapacity: aggregate.Capacity?.utilizedCapacity,
        tags: aggregate.Tags.map(({ id, Tag: tagName }: ({id: string, Tag: string})) => ({ tag: tagName, id })),
      };
    });

  const filteredAggregates =
    selectedTags.length === 0
      ? aggregates
      : aggregates.filter(({ tags }) => tags.some(({ tag }: ({tag: string})) => selectedTags.includes(tag)));

  return (
    <>
      <Heading as="h1" size="lg" mb={5}>
        Aggregates
      </Heading>
      <SearchFilterPoolsBar
        clearAllTags={clearAllTags}
        onTagClick={handleOnTagClick}
        searchText={searchText}
        selectedTags={selectedTags}
        setSearchText={setSearchText}
        onClearSearch={handleOnClearSearch}
      />
      <AggregatesTable
        aggregates={filteredAggregates}
        onTagClick={handleOnTagClick}
        onDeletePoolClick={handleOnDeletePool}
      />
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

export default IpamAggregatesPage;
