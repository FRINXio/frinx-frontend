import { Heading, Progress, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import ipaddr from 'ipaddr.js';
import { GetIpPoolsQuery, GetIpPoolsQueryVariables } from '../../__generated__/graphql';
import useTags from '../../hooks/use-tags';
import useMinisearch from '../../hooks/use-minisearch';
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

const isIpv4 = (name: string) => name === 'ipv4_prefix';

const IpamAggregatesPage: VoidFunctionComponent = () => {
  const [{ data: aggregatesQuery, fetching, error }] = useQuery<GetIpPoolsQuery, GetIpPoolsQueryVariables>({
    query: GET_IP_POOLS,
  });

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
      <AggregatesTable aggregates={filteredAggregates} onTagClick={handleOnTagClick} />
    </>
  );
};

export default IpamAggregatesPage;
