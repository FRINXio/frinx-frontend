import { Box, Button, Flex, Heading, Progress, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import PageContainer from '../../components/page-container';
import { omitNullValue } from '../../helpers/omit-null-value';
import useNotifications from '../../hooks/use-notifications';
import {
  AllocatedResourcesQuery,
  AllocatedResourcesQueryVariables,
  ClaimResourceMutationMutation,
  ClaimResourceMutationMutationVariables,
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  FreeResourceMutationMutation,
  FreeResourceMutationMutationVariables,
  PoolCapacityPayload,
  GetPoolDetailQuery,
  GetPoolDetailQueryVariables,
  GetAllPoolsQuery,
} from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';
import ClaimResourceModal from './claim-resource-modal/claim-resource-modal';
import PoolDetailAllocatingTable from './pool-detail-allocating-table';
import PoolDetailSetSingletonTable from './pool-detail-set_singleton-table';

export type PoolResource = {
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
};

const canClaimResources = (resourcePool: GetPoolDetailQuery['QueryResourcePool'], totalCapacity: number) => {
  return (
    resourcePool.Capacity != null &&
    resourcePool.Capacity.freeCapacity > 0 &&
    resourcePool.Capacity.freeCapacity <= totalCapacity
  );
};

const canFreeResource = (resourcePool: GetPoolDetailQuery['QueryResourcePool'], totalCapacity: number) =>
  resourcePool.Capacity != null && resourcePool.Capacity.freeCapacity !== totalCapacity;

const POOL_DETAIL_QUERY = gql`
  query GetPoolDetail($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
      id
      Name
      PoolType
      Resources {
        Description
        Properties
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
          ParentResource {
            ParentPool {
              id
              Name
            }
          }
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
      Tags {
        id
        Tag
      }
      Capacity {
        freeCapacity
        utilizedCapacity
      }
      ResourceType {
        id
        Name
      }
    }
  }
`;

const POOL_RESOURCES_QUERY = gql`
  query AllocatedResources($poolId: ID!) {
    QueryResources(poolId: $poolId) {
      id
      Properties
      Description
    }
  }
`;

const CLAIM_RESOURCES_MUTATION = gql`
  mutation ClaimResource($poolId: ID!, $description: String!, $userInput: Map!) {
    ClaimResource(poolId: $poolId, description: $description, userInput: $userInput) {
      id
      Properties
    }
  }
`;

const FREE_RESOURCES_MUTATION = gql`
  mutation FreeResource($poolId: ID!, $input: Map!) {
    FreeResource(input: $input, poolId: $poolId)
  }
`;

const DELETE_POOL_MUTATION = gql`
  mutation DeletePool($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
    }
  }
`;

function getTotalCapacity(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  return capacity.freeCapacity + capacity.utilizedCapacity;
}
function getCapacityValue(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  const totalCapacity = getTotalCapacity(capacity);
  if (totalCapacity === 0) {
    return 0;
  }
  return (capacity.utilizedCapacity / totalCapacity) * 100;
}

type Props = {
  poolId: string;
  onPoolClick: (poolId: string) => void;
  onCreateNestedPoolClick: () => void;
  onRowClick: (poolId: string) => void;
};

const PoolDetailPage: VoidFunctionComponent<Props> = React.memo(
  ({ poolId, onPoolClick, onCreateNestedPoolClick, onRowClick }) => {
    const context = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);
    const claimResourceModal = useDisclosure();
    const { addToastNotification } = useNotifications();
    const [{ data: poolData, fetching: isLoadingPool }] = useQuery<GetPoolDetailQuery, GetPoolDetailQueryVariables>({
      query: POOL_DETAIL_QUERY,
      variables: { poolId },
    });
    const [{ data: allocatedResources, fetching: isLoadingResources }] = useQuery<
      AllocatedResourcesQuery,
      AllocatedResourcesQueryVariables
    >({
      query: POOL_RESOURCES_QUERY,
      variables: { poolId },
      context,
    });

    const [, claimResource] = useMutation<ClaimResourceMutationMutation, ClaimResourceMutationMutationVariables>(
      CLAIM_RESOURCES_MUTATION,
    );
    const [, freeResource] = useMutation<FreeResourceMutationMutation, FreeResourceMutationMutationVariables>(
      FREE_RESOURCES_MUTATION,
    );
    const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);

    const claimPoolResource = (description: string, userInput: Record<string, string | number> = {}) => {
      claimResource({
        poolId,
        userInput,
        ...(description != null && { description }),
      })
        .then((response) => {
          if (response.error) {
            throw new Error(response.error.message);
          }

          addToastNotification({
            type: 'success',
            content: 'Successfully claimed resource from pool',
          });
        })
        .catch((error) => {
          addToastNotification({
            type: 'error',
            content: error.message || 'There was a problem with claiming resource from pool',
          });
        });
    };

    const freePoolResource = (userInput: Record<string, string | number>) => {
      freeResource(
        {
          poolId,
          input: userInput,
        },
        { additionalTypenames: ['Resource'] },
      )
        .then((response) => {
          if (response.error) {
            throw new Error(response.error.message);
          }

          addToastNotification({
            type: 'success',
            content: 'Successfully freed resource from pool',
          });
        })
        .catch((error) => {
          addToastNotification({
            type: 'error',
            content: error.message || 'There was a problem with freeing resource from pool',
          });
        });
    };

    const handleDeleteBtnClick = (id: string) => {
      deletePool({ input: { resourcePoolId: id } }, context);
    };

    if (isLoadingPool || isLoadingResources) {
      return <Progress isIndeterminate mt={-10} size="xs" />;
    }

    if (poolData == null || poolData.QueryResourcePool == null || allocatedResources == null) {
      return <Box textAlign="center">Resource pool does not exists</Box>;
    }

    const { QueryResourcePool: resourcePool } = poolData;
    const capacityValue = getCapacityValue(resourcePool.Capacity);
    const totalCapacity = getTotalCapacity(resourcePool.Capacity);
    const nestedPools: GetAllPoolsQuery['QueryResourcePools'] = resourcePool.Resources.map((resource) =>
      resource.NestedPool !== null ? resource.NestedPool : null,
    ).filter(omitNullValue);
    const canCreateNestedPool =
      resourcePool.Resources.length !==
      resourcePool.Resources.filter((resource) => resource.NestedPool !== null).length;

    return (
      <PageContainer>
        <ClaimResourceModal
          isOpen={claimResourceModal.isOpen}
          onClose={claimResourceModal.onClose}
          onClaim={claimPoolResource}
          poolName={resourcePool.Name}
          variant={resourcePool.ResourceType.Name}
        />
        <Flex alignItems="center">
          <Heading size="3xl" as="h2" mb={6}>
            {resourcePool.Name}
          </Heading>
          <Spacer />
          <Box>
            <Button
              onClick={() => claimResourceModal.onOpen()}
              colorScheme="blue"
              variant="outline"
              isDisabled={!canClaimResources(resourcePool, totalCapacity)}
            >
              Claim resources
            </Button>
          </Box>
        </Flex>

        <Box background="white" padding={5}>
          <Text fontSize="lg">Utilized capacity</Text>
          <Progress size="xs" value={capacityValue} />
          <Text as="span" fontSize="xs" color="gray.600" fontWeight={500}>
            {resourcePool.Capacity?.freeCapacity ?? 0} / {totalCapacity}
          </Text>
        </Box>

        <Box my={10}>
          <Flex>
            <Heading size="lg" mb={5}>
              Nested Pools
            </Heading>
            <Spacer />
            <Button
              onClick={onCreateNestedPoolClick}
              colorScheme="blue"
              isDisabled={!canCreateNestedPool}
              title={canCreateNestedPool ? '' : 'Cannot create nested pool, because there are no free resources'}
            >
              Create nested pool
            </Button>
          </Flex>
          <PoolsTable
            pools={nestedPools}
            isLoading={isLoadingPool}
            onDeleteBtnClick={handleDeleteBtnClick}
            onPoolNameClick={onPoolClick}
            onRowClick={onRowClick}
          />
        </Box>

        <Box my={10}>
          <Heading size="lg" mb={5}>
            Allocated Resources
          </Heading>
          {resourcePool.PoolType === 'allocating' && (
            <PoolDetailAllocatingTable
              allocatedResources={allocatedResources.QueryResources}
              onFreeResource={freePoolResource}
              canFreeResource={canFreeResource(resourcePool, totalCapacity)}
            />
          )}
          {(resourcePool.PoolType === 'set' || resourcePool.PoolType === 'singleton') && (
            <PoolDetailSetSingletonTable
              resources={resourcePool.Resources}
              allocatedResources={allocatedResources.QueryResources}
              onFreeResource={freePoolResource}
              onClaimResource={claimPoolResource}
            />
          )}
        </Box>
      </PageContainer>
    );
  },
);

export default PoolDetailPage;
