import { Heading, Progress } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { IPv4, IPv6 } from 'ipaddr.js';
import { useMinisearch } from '@frinx/shared/src';
import useTags from '../../hooks/use-tags';
import { GetPoolIpRangesQuery, GetPoolIpRangesQueryVariables } from '../../__generated__/graphql';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import IpRangesTable from './ip-ranges-table';

const GET_POOLS_QUERY = gql`
  query GetPoolIpRanges {
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
`;

const isIpv4 = (name: string) => name === 'ipv4_prefix';

const getAddressesFromCIDR = (cidr: string, resourceTypeName: string) => ({
  network: isIpv4(resourceTypeName)
    ? IPv4.networkAddressFromCIDR(cidr).toString()
    : IPv6.networkAddressFromCIDR(cidr).toString(),
  broadcast: isIpv4(resourceTypeName)
    ? IPv4.broadcastAddressFromCIDR(cidr).toString()
    : IPv6.broadcastAddressFromCIDR(cidr).toString(),
});

const IpamIpRangesPage: VoidFunctionComponent = () => {
  const [{ data, fetching, error }] = useQuery<GetPoolIpRangesQuery, GetPoolIpRangesQueryVariables>({
    query: GET_POOLS_QUERY,
  });

  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();
  const { results, searchText, setSearchText } = useMinisearch({
    items: data?.QueryRootResourcePools.filter(
      (pool) => pool.ResourceType.Name === 'ipv4_prefix' || pool.ResourceType.Name === 'ipv6_prefix',
    ),
    searchFields: ['Name', 'PoolProperties'],
    extractField: (document, fieldName) => {
      if (fieldName === 'PoolProperties') {
        return JSON.stringify(document[fieldName]);
      }

      return document[fieldName];
    },
  });

  const handleOnClearSearch = () => {
    clearAllTags();
    setSearchText('');
  };

  if (fetching) {
    return <Progress isIndeterminate size="sm" mt={-10} />;
  }

  if (error != null) {
    return <Heading>There was problem with loading of ip ranges</Heading>;
  }

  const ipRanges = results
    .filter((result) =>
      selectedTags.length > 0 ? result.Tags.some(({ Tag: tag }) => selectedTags.includes(tag)) : true,
    )
    .map(({ Capacity, Name, PoolProperties, Tags, id, ResourceType, Resources }) => {
      const { network, broadcast } = getAddressesFromCIDR(
        `${PoolProperties.address}/${PoolProperties.prefix}`,
        ResourceType.Name,
      );
      return {
        id,
        name: Name,
        size: Capacity != null ? BigInt(Capacity.utilizedCapacity) + BigInt(Capacity.freeCapacity) : 0,
        freeCapacity: Capacity != null ? BigInt(Capacity.freeCapacity) : 0,
        tags: Tags,
        network: `${network}/${PoolProperties.prefix}`,
        broadcast: `${broadcast}/${PoolProperties.prefix}`,
        nestedRanges: Resources.filter(({ NestedPool }) => NestedPool != null)
          .filter(
            (resource) =>
              resource?.NestedPool?.ResourceType.Name === 'ipv4_prefix' ||
              resource?.NestedPool?.ResourceType.Name === 'ipv6_prefix',
          )
          .map((resource) => ({
            id: resource.id,
            nestedPoolId: resource.NestedPool?.id,
          })),
      };
    });

  return (
    <>
      <Heading as="h1" size="lg" mb={5}>
        IP Ranges
      </Heading>
      <SearchFilterPoolsBar
        searchText={searchText}
        setSearchText={setSearchText}
        clearAllTags={clearAllTags}
        selectedTags={selectedTags}
        onTagClick={handleOnTagClick}
        onClearSearch={handleOnClearSearch}
      />
      <IpRangesTable ipRanges={ipRanges} onTagClick={handleOnTagClick} />
    </>
  );
};

export default IpamIpRangesPage;
