import { Heading, Progress } from '@chakra-ui/react';
import { IPv4, IPv6 } from 'ipaddr.js';
import { compact } from 'lodash';
import React, { VoidFunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { useMinisearch, useTags } from '@frinx/shared/src';
import SearchFilterPoolsBar from '../../../components/search-filter-pools-bar';
import useResourcePoolActions from '../../../hooks/use-resource-pool-actions';
import IpRangesTable from '../ip-ranges-table';

const isIpv4 = (name: string) => name === 'ipv4_prefix';

const getAddressesFromCIDR = (cidr: string, resourceTypeName: string) => ({
  network: isIpv4(resourceTypeName)
    ? IPv4.networkAddressFromCIDR(cidr).toString()
    : IPv6.networkAddressFromCIDR(cidr).toString(),
  broadcast: isIpv4(resourceTypeName)
    ? IPv4.broadcastAddressFromCIDR(cidr).toString()
    : IPv6.broadcastAddressFromCIDR(cidr).toString(),
});

const IpamNestedIpRangesDetailPage: VoidFunctionComponent = () => {
  const { id } = useParams();

  const [{ poolDetail }, { deleteResourcePool }] = useResourcePoolActions({ poolId: id });

  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();
  const { results, searchText, setSearchText } = useMinisearch({
    items: compact(
      poolDetail.data?.QueryResourcePool.Resources.map((resource) => resource.NestedPool).filter(
        (resource) => resource?.ResourceType.Name === 'ipv4_prefix' || resource?.ResourceType.Name === 'ipv6_prefix',
      ),
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

  if (poolDetail.fetching) {
    return <Progress isIndeterminate size="sm" mt={-10} />;
  }

  if (poolDetail.error != null || poolDetail.data?.QueryResourcePool == null) {
    return <Heading>There was problem to load nested ip ranges</Heading>;
  }

  const nestedIpRanges = results
    .filter(({ Tags }) => (selectedTags.length > 0 ? Tags.some(({ Tag: tag }) => selectedTags.includes(tag)) : true))
    .map(({ Capacity, Name, PoolProperties, Tags, id: ipRangeId, ResourceType, Resources }) => {
      const { network, broadcast } = getAddressesFromCIDR(
        `${PoolProperties.address}/${PoolProperties.prefix}`,
        ResourceType.Name,
      );
      return {
        id: ipRangeId,
        name: Name,
        totalCapacity: Capacity != null ? BigInt(Capacity.utilizedCapacity) + BigInt(Capacity.freeCapacity) : 0,
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
        IP Ranges of {poolDetail.data?.QueryResourcePool.Name}
      </Heading>
      <SearchFilterPoolsBar
        searchText={searchText}
        setSearchText={setSearchText}
        clearAllTags={clearAllTags}
        selectedTags={selectedTags}
        onTagClick={handleOnTagClick}
        onClearSearch={handleOnClearSearch}
      />
      <IpRangesTable ipRanges={nestedIpRanges} onTagClick={handleOnTagClick} onDeleteBtnClick={deleteResourcePool} />
    </>
  );
};

export default IpamNestedIpRangesDetailPage;