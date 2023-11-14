import { Box, Button, Flex, Heading, HStack, Icon, Spacer } from '@chakra-ui/react';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { IPv4, IPv6 } from 'ipaddr.js';
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
import { Link } from 'react-router-dom';
import {
  DeleteResourcePoolMutation,
  DeleteResourcePoolMutationVariables,
  GetPoolIpRangesQuery,
  GetPoolIpRangesQueryVariables,
} from '../../__generated__/graphql';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import IpRangesTable from './ip-ranges-table';
import Ipv46PrefixSwitch from '../../components/ipv46-prefix-switch';

const GET_POOLS_QUERY = gql`
  query GetPoolIpRanges(
    $first: Int
    $last: Int
    $before: Cursor
    $after: Cursor
    $resourceTypeId: ID
    $filterByResources: Map
  ) {
    resourceManager {
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
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  }
`;

const DELETE_POOL_MUTATION = gql`
  mutation DeleteIpRangesPool($input: DeleteResourcePoolInput!) {
    resourceManager {
      DeleteResourcePool(input: $input) {
        resourcePoolId
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

const ipv4PrefixId = '25769803776';
const ipv6PrefixId = '25769803780';

const IpamIpRangesPage: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [searchName, setSearchName] = useState<string>('');
  const [isIpv4Prefix, setIsIpv4Prefix] = useState<boolean>(true);
  const [paginationArgs, { nextPage, previousPage, firstPage, setItemsCount }] = usePagination();

  const [{ data, fetching, error }] = useQuery<GetPoolIpRangesQuery, GetPoolIpRangesQueryVariables>({
    query: GET_POOLS_QUERY,
    variables: {
      ...(paginationArgs?.first !== null && { first: paginationArgs.first }),
      ...(paginationArgs?.last !== null && { last: paginationArgs.last }),
      ...(paginationArgs?.after !== null && { after: paginationArgs.after }),
      ...(paginationArgs?.before !== null && { before: paginationArgs.before }),
      resourceTypeId: isIpv4Prefix ? ipv4PrefixId : ipv6PrefixId,
    },
    context,
  });

  const [, deletePool] = useMutation<DeleteResourcePoolMutation, DeleteResourcePoolMutationVariables>(
    DELETE_POOL_MUTATION,
  );

  const allIpamIpRanges = (data?.resourceManager.QueryRootResourcePools.edges || [])
    ?.map((e) => {
      return e?.node ?? null;
    })
    .filter(omitNullValue);

  const { addToastNotification } = useNotifications();
  const [selectedTags, { clearAllTags, handleOnTagClick }] = useTags();
  const { results, setSearchText } = useMinisearch({
    items: allIpamIpRanges,
  });

  const handleOnClearSearch = () => {
    clearAllTags();
    setSearchText('');
    firstPage();
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

  if (error != null) {
    return <Heading>There was problem with loading of ip ranges</Heading>;
  }

  const ipRanges = results
    .filter((result) =>
      selectedTags.length > 0 ? result.Tags.some(({ Tag: tag }: { Tag: string }) => selectedTags.includes(tag)) : true,
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

  const onSearchClick = () => {
    setSearchText(searchName);
  };

  return (
    <>
      <HStack mb={5}>
        <Heading as="h1" size="xl">
          IP Ranges
        </Heading>
        <Spacer />
        <Button
          data-cy="create-pool-btn"
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
        searchName={searchName}
        setSearchName={setSearchName}
        onSearchClick={onSearchClick}
        clearAllTags={clearAllTags}
        selectedTags={selectedTags}
        onTagClick={handleOnTagClick}
        onClearSearch={handleOnClearSearch}
      />
      <Ipv46PrefixSwitch
        isIpv4={isIpv4Prefix}
        setIsIpv4={setIsIpv4Prefix}
        clearAllTags={clearAllTags}
        firstPage={firstPage}
      />

      <IpRangesTable
        fetching={fetching}
        ipRanges={ipRanges}
        onTagClick={handleOnTagClick}
        onDeleteBtnClick={handleOnDeletePool}
      />
      <Flex align="center" justify="space-between">
        {data && (
          <Box marginTop={4} paddingX={4}>
            <Pagination
              onPrevious={previousPage(data.resourceManager.QueryRootResourcePools.pageInfo.startCursor)}
              onNext={nextPage(data.resourceManager.QueryRootResourcePools.pageInfo.endCursor)}
              hasNextPage={data.resourceManager.QueryRootResourcePools.pageInfo.hasNextPage}
              hasPreviousPage={data.resourceManager.QueryRootResourcePools.pageInfo.hasPreviousPage}
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

export default IpamIpRangesPage;
