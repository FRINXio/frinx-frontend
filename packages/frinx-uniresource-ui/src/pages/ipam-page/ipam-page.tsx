import { Box, Button, Flex, Heading, Icon, Progress } from '@chakra-ui/react';
import { useMinisearch, useNotifications, useTags } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import SearchFilterPoolsBar from '../../components/search-filter-pools-bar';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetAllIpPoolsQuery,
} from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';

const POOLS_QUERY = gql`
  query GetAllIPPools {
    QueryRootResourcePools {
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

const IpamPoolPage: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [{ data, fetching: isQueryLoading, error }] = useQuery<GetAllIpPoolsQuery>({
    query: POOLS_QUERY,
    context,
  });
  const [{ fetching: isMutationLoading }, deletePool] = useMutation<
    DeletePoolMutation,
    DeletePoolMutationMutationVariables
  >(DELETE_POOL_MUTATION);
  const { addToastNotification } = useNotifications();
  const { searchText, setSearchText, results } = useMinisearch({
    items: data?.QueryRootResourcePools.filter(
      (pool) => pool.ResourceType.Name === 'ipv4_prefix' || pool.ResourceType.Name === 'ipv6_prefix',
    ),
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

  const handleOnClearSearch = () => {
    setSearchText('');
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
        <Heading as="h1" size="lg">
          Pools
        </Heading>
        <Box marginLeft="auto">
          <Button
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
        />
        <PoolsTable
          pools={ipPools}
          isLoading={isQueryLoading || isMutationLoading}
          onDeleteBtnClick={handleDeleteBtnClick}
          onTagClick={handleOnTagClick}
        />
      </Box>
    </>
  );
};

export default IpamPoolPage;
