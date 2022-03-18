import { Box, Progress } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import PageContainer from '../components/page-container';
import { omitNullValue } from '../helpers/omit-null-value';
import PoolsTable from '../pages/pools-page/pools-table';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetNestedPoolsDetailQuery,
  GetNestedPoolsDetailQueryVariables,
} from '../__generated__/graphql';

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

type Props = {
  poolId: string;
  onPoolClick: (poolId: string) => void;
  onCreateNestedPoolClick: () => void;
  onRowClick: (poolId: string) => void;
};

const NestedPoolsDetailPage: VoidFunctionComponent<Props> = React.memo(({ poolId, onPoolClick, onRowClick }) => {
  const [detailId, setDetailId] = useState(poolId);
  const context = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);
  const [{ data: poolData, fetching: isLoadingPool }] = useQuery<
    GetNestedPoolsDetailQuery,
    GetNestedPoolsDetailQueryVariables
  >({
    query: POOL_DETAIL_QUERY,
    variables: { poolId },
  });
  const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);

  // need to set detailId in useeffect because poolId on first load is cached and shows value
  // from previous page and then it will push you to the same page
  useEffect(() => {
    setDetailId(poolId);
  }, [poolId]);

  const handleDeleteBtnClick = (id: string) => {
    deletePool({ input: { resourcePoolId: id } }, context);
  };

  const handleOnRowClick = (id: string) => {
    if (id !== detailId) {
      onRowClick(id);
    }
  };

  if (isLoadingPool) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (poolData == null || poolData.QueryResourcePool == null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const { QueryResourcePool: resourcePool } = poolData;
  const nestedPools = resourcePool.Resources.map((resource) =>
    resource.NestedPool !== null ? resource.NestedPool : null,
  ).filter(omitNullValue);

  return (
    <PageContainer>
      <Box my={10}>
        <PoolsTable
          pools={[resourcePool]}
          isLoading={isLoadingPool}
          onDeleteBtnClick={handleDeleteBtnClick}
          onPoolNameClick={onPoolClick}
          onRowClick={handleOnRowClick}
        />
        <Box ml={10}>
          <PoolsTable
            pools={nestedPools}
            isLoading={isLoadingPool}
            onDeleteBtnClick={handleDeleteBtnClick}
            onPoolNameClick={onPoolClick}
            onRowClick={onRowClick}
          />
        </Box>
      </Box>
    </PageContainer>
  );
});

export default NestedPoolsDetailPage;
