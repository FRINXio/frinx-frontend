import { Button, Heading, HStack, Icon, Progress, Spacer } from '@chakra-ui/react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { IPv4, IPv6 } from 'ipaddr.js';
import { useMinisearch, useNotifications, useTags } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import {
  DeleteResourcePoolMutation,
  DeleteResourcePoolMutationVariables,
  GetPoolIpRangesQuery,
  GetPoolIpRangesQueryVariables,
} from '../../__generated__/graphql';
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

const DELETE_POOL_MUTATION = gql`
  mutation DeleteResourcePool($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
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
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [{ data, fetching, error }] = useQuery<GetPoolIpRangesQuery, GetPoolIpRangesQueryVariables>({
    query: GET_POOLS_QUERY,
    context,
  });

  const [, deletePool] = useMutation<DeleteResourcePoolMutation, DeleteResourcePoolMutationVariables>(
    DELETE_POOL_MUTATION,
  );

  const { addToastNotification } = useNotifications();
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

  const handleOnDeletePool = (resourcePoolId: string) => {
    deletePool(
      {
        input: {
          resourcePoolId,
        },
      },
      context,
    )
      .then(({ error: deleteError }) => {
        if (deleteError) {
          throw deleteError;
        }

        addToastNotification({
          content: 'Pool has been deleted',
          type: 'success',
        });
      })
      .catch((deleteError) => {
        addToastNotification({
          title: 'Error deleting pool',
          content: deleteError.message,
          type: 'error',
        });
      });
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
      const utilizedCapacity = BigInt(Number(Capacity?.utilizedCapacity));
      const freeCapacity = BigInt(Number(Capacity?.freeCapacity));
      return {
        id,
        name: Name,
        totalCapacity: utilizedCapacity + freeCapacity,
        freeCapacity,
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
      <HStack mb={5}>
        <Heading as="h1" size="xl">
          IP Ranges
        </Heading>
        <Spacer />
        <Button
          mr={2}
          leftIcon={<Icon size={20} as={FeatherIcon} icon="plus" />}
          colorScheme="blue"
          as={Link}
          to="/resource-manager/pools/new?resource-type-name=ipv4_prefix"
        >
          Create Pool
        </Button>
      </HStack>
      <SearchFilterPoolsBar
        searchText={searchText}
        setSearchText={setSearchText}
        clearAllTags={clearAllTags}
        selectedTags={selectedTags}
        onTagClick={handleOnTagClick}
        onClearSearch={handleOnClearSearch}
      />
      <IpRangesTable ipRanges={ipRanges} onTagClick={handleOnTagClick} onDeleteBtnClick={handleOnDeletePool} />
    </>
  );
};

export default IpamIpRangesPage;
