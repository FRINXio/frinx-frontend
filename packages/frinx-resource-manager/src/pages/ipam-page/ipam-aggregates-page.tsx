import { Box, Flex, FormControl, FormLabel, Heading, Switch, Text } from '@chakra-ui/react';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import ipaddr from 'ipaddr.js';
import { useMinisearch, useTags, useNotifications, omitNullValue } from '@frinx/shared/src';
import {
  DeleteIpPoolMutation,
  DeleteIpPoolMutationVariables,
  GetPoolAggregatesQuery,
  GetPoolAggregatesQueryVariables,
} from '../../__generated__/graphql';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import AggregatesTable from './aggregates-table';
import Pagination from '../../components/pagination';
import { usePagination } from '../../hooks/use-pagination';

const GET_IP_POOLS = gql`
  query GetPoolAggregates(
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
  const [searchName, setSearchName] = useState<string>('');
  const [isIpv4Prefix, setIsIpv4Prefix] = useState<boolean>(true);
  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();

  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [paginationArgs, { nextPage, previousPage, firstPage, setItemsCount }] = usePagination();

  const ipv4PrefixId = '25769803776';
  const ipv6PrefixId = '25769803780';

  const [{ data, fetching, error }] = useQuery<GetPoolAggregatesQuery, GetPoolAggregatesQueryVariables>({
    query: GET_IP_POOLS,
    variables: {
      ...(paginationArgs?.first !== null && { first: paginationArgs.first }),
      ...(paginationArgs?.last !== null && { last: paginationArgs.last }),
      ...(paginationArgs?.after !== null && { after: paginationArgs.after }),
      ...(paginationArgs?.before !== null && { before: paginationArgs.before }),
      resourceTypeId: isIpv4Prefix ? ipv4PrefixId : ipv6PrefixId,
      tags: { matchesAny: [{ matchesAll: selectedTags }] },
    },
    context,
  });
  const [, deletePoolMutation] = useMutation<DeleteIpPoolMutation, DeleteIpPoolMutationVariables>(DELETE_POOL_MUTATION);

  const allAggregates = (data?.QueryRootResourcePools.edges ?? [])
    ?.map((e) => {
      return e?.node ?? null;
    })
    .filter(omitNullValue);

  const { addToastNotification } = useNotifications();
  const { results, setSearchText } = useMinisearch({
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

  const onSearchClick = () => {
    setSearchText(searchName);
  };

  const handleSwitch = () => {
    clearAllTags();
    setIsIpv4Prefix((prevState) => !prevState);
    firstPage();
  };

  if (error != null) {
    return <Text>No aggregates exists</Text>;
  }

  const aggregates = results.map((aggregate) => {
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
      tags: aggregate.Tags.map(({ id, Tag: tagName }: { id: string; Tag: string }) => ({ tag: tagName, id })),
    };
  });

  return (
    <>
      <Heading as="h1" size="lg" mb={5}>
        Aggregates
      </Heading>
      <SearchFilterPoolsBar
        setPageItemsCount={setItemsCount}
        searchName={searchName}
        setSearchName={setSearchName}
        onSearchClick={onSearchClick}
        clearAllTags={clearAllTags}
        onTagClick={handleOnTagClick}
        selectedTags={selectedTags}
        onClearSearch={handleOnClearSearch}
        canSetItemsPerPage
      />
      <FormControl mb={5}>
        <Flex align="center">
          <FormLabel m={0}>{isIpv4Prefix ? 'Resource type - ipv4_prefix' : 'Resource type - ipv6_prefix'}</FormLabel>
          <Switch
            size="md"
            ml={5}
            onChange={handleSwitch}
            data-cy="ipv4-ipv6-switch"
            name="isNested"
            isChecked={isIpv4Prefix}
          />
        </Flex>
      </FormControl>
      <AggregatesTable
        aggregates={aggregates}
        fetching={fetching}
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
