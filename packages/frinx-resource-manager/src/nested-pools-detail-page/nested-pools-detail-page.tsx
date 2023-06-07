import { Box, Heading, Progress } from '@chakra-ui/react';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import { unwrap, useNotifications, useMinisearch, useTags, omitNullValue } from '@frinx/shared/src';
import PageContainer from '../components/page-container';
import PoolsTable from '../pages/pools-page/pools-table';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetNestedPoolsDetailQuery,
  GetNestedPoolsDetailQueryVariables,
} from '../__generated__/graphql';
import SearchFilterPoolsBar from '../components/search-filter-pools-bar';

const POOL_DETAIL_QUERY = gql`
  query GetNestedPoolsDetail($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
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
        Script
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
            Script
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

const NestedPoolsDetailPage: VoidFunctionComponent = () => {
  const [allocatedResources, setAllocatedResources] = useState({});
  const [searchName, setSearchName] = useState<string>('');
  const { poolId } = useParams<{ poolId: string }>();
  const [{ data: poolData, fetching: isLoadingPool }] = useQuery<
    GetNestedPoolsDetailQuery,
    GetNestedPoolsDetailQueryVariables
  >({
    query: POOL_DETAIL_QUERY,

    variables: { poolId: unwrap(poolId) },
  });
  const resources = (poolData?.QueryResourcePool.Resources || [])
    .map(({ NestedPool }) => {
      return NestedPool ?? null;
    })
    .filter(omitNullValue);

  const { results, setSearchText } = useMinisearch({ items: resources });
  const [selectedTags, { handleOnTagClick, clearAllTags }] = useTags();

  const context = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);
  const { addToastNotification } = useNotifications();

  const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);

  if (poolId == null) {
    return null;
  }

  const handleOnClearSearch = () => {
    setSearchText('');
    clearAllTags();
  };

  const handleDeleteBtnClick = (id: string) => {
    deletePool({ input: { resourcePoolId: id } }, context)
      .then(({ error }) => {
        if (error) {
          throw error;
        }

        addToastNotification({
          content: 'The pool has been deleted',
          type: 'success',
        });
      })
      .catch((err) => {
        addToastNotification({
          title: 'We could not delete the pool',
          content: err.message,
          type: 'error',
        });
      });
  };

  const onSearchClick = () => {
    setSearchText(searchName);
  };

  const resourcePools = results.filter((pool) => {
    if (selectedTags.length > 0) {
      return pool.Tags.some((poolTag) => selectedTags.includes(poolTag.Tag));
    }

    return true;
  });

  if (isLoadingPool) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (poolData == null || poolData.QueryResourcePool == null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const { QueryResourcePool: resourcePool } = poolData;

  return (
    <PageContainer>
      <Heading size="lg" mb={5}>
        Nested pools
      </Heading>
      <SearchFilterPoolsBar
        allocatedResources={allocatedResources}
        setAllocatedResources={setAllocatedResources}
        setSearchName={setSearchName}
        searchName={searchName}
        onSearchClick={onSearchClick}
        selectedTags={selectedTags}
        clearAllTags={clearAllTags}
        onTagClick={handleOnTagClick}
        onClearSearch={handleOnClearSearch}
        canFilterByResourceType
      />
      <Box my={10}>
        <PoolsTable
          pools={[resourcePool]}
          isLoading={isLoadingPool}
          onDeleteBtnClick={handleDeleteBtnClick}
          isNestedShown={false}
        />
        <Box ml={10}>
          <PoolsTable
            pools={resourcePools}
            onTagClick={handleOnTagClick}
            isLoading={isLoadingPool}
            onDeleteBtnClick={handleDeleteBtnClick}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default NestedPoolsDetailPage;
