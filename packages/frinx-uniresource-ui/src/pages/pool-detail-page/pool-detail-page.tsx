import { Box, Button, Flex, Heading, Progress, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import PageContainer from '../../components/page-container';
import useNotifications from '../../hooks/use-notifications';
import {
  AllocatedResourcesQuery,
  AllocatedResourcesQueryVariables,
  ClaimResourceMutationMutation,
  ClaimResourceMutationMutationVariables,
  FreeResourceMutationMutation,
  FreeResourceMutationMutationVariables,
  PoolCapacityPayload,
  PoolDetailQuery,
  PoolDetailQueryVariables,
} from '../../__generated__/graphql';
import ClaimResourceModal from './claim-resource-modal/claim-resource-modal';
import PoolDetailAllocatingTable from './pool-detail-allocating-table';
import PoolDetailSetSingletonTable from './pool-detail-set_singleton-table';

export type PoolResource = {
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
};

const canShowClaimResourceModal = (resourcePool: PoolDetailQuery['QueryResourcePool']) => {
  if (resourcePool.PoolType === 'allocating') {
    return (
      resourcePool.ResourceType.Name === 'ipv4_prefix' ||
      resourcePool.ResourceType.Name === 'vlan_range' ||
      resourcePool.ResourceType.Name === 'vlan'
    );
  }

  return false;
};

const canClaimResources = (resourcePool: PoolDetailQuery['QueryResourcePool'], totalCapacity: number) => {
  return (
    resourcePool.Capacity != null &&
    resourcePool.Capacity.freeCapacity > 0 &&
    resourcePool.Capacity.freeCapacity <= totalCapacity
  );
};

const canFreeResource = (resourcePool: PoolDetailQuery['QueryResourcePool'], totalCapacity: number) =>
  resourcePool.Capacity != null && resourcePool.Capacity.freeCapacity !== totalCapacity;

const POOL_DETAIL_QUERY = gql`
  query PoolDetail($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
      id
      Name
      PoolType
      Resources {
        Description
        Properties
        id
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
};

const PoolDetailPage: VoidFunctionComponent<Props> = React.memo(({ poolId }) => {
  const context = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);
  const claimResourceModal = useDisclosure();
  const { addToastNotification } = useNotifications();
  const [{ data: poolData, fetching: isLoadingPool }] = useQuery<PoolDetailQuery, PoolDetailQueryVariables>({
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

  const claimPoolResource = (description = '', userInput: Record<string, string | number> = {}) => {
    claimResource({
      poolId,
      userInput,
      ...(description != null && { description }),
    })
      .then(() => {
        addToastNotification({
          type: 'success',
          content: 'Successfully claimed resource from pool',
        });
      })
      .catch(() => {
        addToastNotification({
          type: 'error',
          content: 'There was a problem with claiming resource from pool',
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
      .then(() => {
        addToastNotification({
          type: 'success',
          content: 'Successfully freed resource from pool',
        });
      })
      .catch(() => {
        addToastNotification({
          type: 'error',
          content: 'There was a problem with freeing resource from pool',
        });
      });
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
            onClick={() =>
              canShowClaimResourceModal(resourcePool) ? claimResourceModal.onOpen() : claimPoolResource()
            }
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
        <Heading size="lg">Allocated Resources</Heading>
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
          />
        )}
      </Box>
    </PageContainer>
  );
});

export default PoolDetailPage;
