import { Heading, Progress, Text } from '@chakra-ui/react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import ipaddr from 'ipaddr.js';
import { useMinisearch, useTags, useNotifications } from '@frinx/shared/src';
import {
  DeleteIpPoolMutation,
  DeleteIpPoolMutationVariables,
  GetIpPoolsQuery,
  GetIpPoolsQueryVariables,
} from '../../__generated__/graphql';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import AggregatesTable from './aggregates-table';

const GET_IP_POOLS = gql`
  query GetIpPools {
    QueryRootResourcePools {
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
      PoolProperties
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
  const [{ data: aggregatesQuery, fetching, error }] = useQuery<GetIpPoolsQuery, GetIpPoolsQueryVariables>({
    query: GET_IP_POOLS,
    context,
  });
  const [, deletePoolMutation] = useMutation<DeleteIpPoolMutation, DeleteIpPoolMutationVariables>(DELETE_POOL_MUTATION);

  const { addToastNotification } = useNotifications();
  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();
  const { results, searchText, setSearchText } = useMinisearch({
    items: aggregatesQuery?.QueryRootResourcePools,
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
        tags: aggregate.Tags.map(({ id, Tag: tagName }) => ({ tag: tagName, id })),
      };
    });

  const filteredAggregates =
    selectedTags.length === 0
      ? aggregates
      : aggregates.filter(({ tags }) => tags.some(({ tag }) => selectedTags.includes(tag)));

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
    </>
  );
};

export default IpamAggregatesPage;
