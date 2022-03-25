import { Box, Heading, Progress } from '@chakra-ui/react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import PageContainer from '../components/page-container';
import { omitNullValue } from '../helpers/omit-null-value';
import unwrap from '../helpers/unwrap';
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

const NestedPoolsDetailPage: VoidFunctionComponent = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const context = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);
  const [{ data: poolData, fetching: isLoadingPool }] = useQuery<
    GetNestedPoolsDetailQuery,
    GetNestedPoolsDetailQueryVariables
  >({
    query: POOL_DETAIL_QUERY,
    variables: { poolId: unwrap(poolId) },
  });
  const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);

  if (poolId == null) {
    return null;
  }

  const handleDeleteBtnClick = (id: string) => {
    deletePool({ input: { resourcePoolId: id } }, context);
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
      <Heading size="lg" mb={5}>
        Nested pools
      </Heading>
      <Box my={10}>
        <PoolsTable
          pools={[resourcePool]}
          isLoading={isLoadingPool}
          onDeleteBtnClick={handleDeleteBtnClick}
          isNestedShown={false}
        />
        <Box ml={10}>
          <PoolsTable pools={nestedPools} isLoading={isLoadingPool} onDeleteBtnClick={handleDeleteBtnClick} />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default NestedPoolsDetailPage;
