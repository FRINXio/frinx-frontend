import { Box, Button, Flex, Heading, Icon, Progress } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import useNotifications from '../../hooks/use-notifications';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetPoolsQuery,
  GetPoolsQueryVariables,
} from '../../__generated__/graphql';
import PoolsTable from './pools-table';
import { Searchbar } from '../../components/searchbar';
import useMinisearch from '../../hooks/use-minisearch';
import useTags from '../../hooks/use-tags';
import SearchTags from '../../components/search-tags';

const ALL_POOLS_QUERY = gql`
  query GetPools {
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

const PoolsPage: VoidFunctionComponent = () => {
  const [selectedTags, { handleOnTagClick, clearAllTags }] = useTags();
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [{ data, fetching: isQueryLoading, error }] = useQuery<GetPoolsQuery, GetPoolsQueryVariables>({
    query: ALL_POOLS_QUERY,
    context,
  });
  const [{ fetching: isMutationLoading }, deletePool] = useMutation<
    DeletePoolMutation,
    DeletePoolMutationMutationVariables
  >(DELETE_POOL_MUTATION);
  const { addToastNotification } = useNotifications();
  const { results, searchText, setSearchText } = useMinisearch({ items: data?.QueryRootResourcePools });

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

  if (error != null || data == null) {
    return <div>{error?.message}</div>;
  }

  if (isQueryLoading) {
    return <Progress isIndeterminate size="lg" />;
  }

  const resourcePools =
    selectedTags.length === 0
      ? results
      : results.filter((pool) => pool.Tags.some((poolTag) => selectedTags.includes(poolTag.Tag)));

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
            to="new"
          >
            Create Pool
          </Button>
        </Box>
      </Flex>
      <Searchbar value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <SearchTags selectedTags={selectedTags} handleOnTagClick={handleOnTagClick} clearAllTags={clearAllTags} />
      <Box position="relative" marginBottom={5}>
        <Box position="absolute" top={0} left={0} right={0}>
          {data != null && (isQueryLoading || isMutationLoading) && <Progress isIndeterminate size="xs" />}
        </Box>
        <PoolsTable
          pools={resourcePools}
          isLoading={isQueryLoading || isMutationLoading}
          onDeleteBtnClick={handleDeleteBtnClick}
          onTagClick={handleOnTagClick}
        />
      </Box>
    </>
  );
};

export default PoolsPage;
