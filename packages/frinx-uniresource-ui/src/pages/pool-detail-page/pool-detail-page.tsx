import { Box, Button, ButtonGroup, Flex, Heading, Progress, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import React, { FC } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import PageContainer from '../../components/page-container';
import {
  ClaimResourceMutationMutation,
  ClaimResourceMutationMutationVariables,
  FreeResourceMutationMutation,
  FreeResourceMutationMutationVariables,
  PoolCapacityPayload,
  QueryPoolDetailQuery,
  QueryPoolDetailQueryVariables,
  ResourceConnection,
} from '../../__generated__/graphql';
import ClaimResourceAllocIpv4PrefixModal from './claim-resource-modal/claim-resource-allocating-modals/claim-resource-allocating-ipv4_prefix';
import ClaimResourceModal from './claim-resource-modal/claim-resource-modal';
import PoolDetailTable from './pool-detail-table';

type Props = {
  poolId: string;
};

export type PoolResource = {
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
};

const POOL_DETAIL_QUERY = gql`
  query QueryPoolDetail($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
      id
      Name
      PoolType
      allocatedResources {
        edges {
          node {
            Description
            Properties
          }
        }
        totalCount
      }
      Tags {
        id
        Tag
      }
      Capacity {
        freeCapacity
        utilizedCapacity
      }
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

const PoolDetailPage: FC<Props> = ({ poolId }) => {
  const claimResourceModal = useDisclosure();
  const [{ data, fetching: isLoadingPool }] = useQuery<QueryPoolDetailQuery, QueryPoolDetailQueryVariables>({
    query: POOL_DETAIL_QUERY,
    variables: {
      poolId,
    },
  });

  const [, claimResource] = useMutation<ClaimResourceMutationMutation, ClaimResourceMutationMutationVariables>(
    CLAIM_RESOURCES_MUTATION,
  );
  const [, freeResource] = useMutation<FreeResourceMutationMutation, FreeResourceMutationMutationVariables>(
    FREE_RESOURCES_MUTATION,
  );

  const claimPoolResource = (userInput: Record<string, string | number>, description?: string) => {
    claimResource({
      poolId,
      userInput,
      ...(description != null && { description }),
    });
  };

  const freePoolResource = (userInput: Map<string, string | number>) => {
    freeResource({
      poolId,
      input: userInput,
    });
  };

  if (isLoadingPool) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (data == null || data.QueryResourcePool == null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const { QueryResourcePool: resourcePool } = data;
  const capacityValue = getCapacityValue(resourcePool.Capacity);
  const totalCapacity = getTotalCapacity(resourcePool.Capacity);
  const canClaimResources =
    resourcePool.Capacity != null &&
    resourcePool.Capacity.freeCapacity > 0 &&
    resourcePool.Capacity.freeCapacity <= totalCapacity;
  const canFreeResources = resourcePool.Capacity != null && resourcePool.Capacity.freeCapacity !== totalCapacity;

  return (
    <PageContainer>
      <ClaimResourceAllocIpv4PrefixModal
        poolName={resourcePool.Name}
        isOpen={claimResourceModal.isOpen}
        onClose={claimResourceModal.onClose}
        onClaim={claimPoolResource}
      />
      <Flex alignItems="center">
        <Heading size="3xl" as="h2" mb={6}>
          {resourcePool.Name}
        </Heading>
        <Spacer />
        <Box>
          <ButtonGroup spacing={6} variant="outline">
            <Button onClick={claimResourceModal.onOpen} colorScheme="blue" isDisabled={!canClaimResources}>
              Claim resources
            </Button>
            <Button onClick={() => console.log('freeol som')} colorScheme="red" isDisabled={!canFreeResources}>
              Free resources
            </Button>
          </ButtonGroup>
        </Box>
      </Flex>

      <Box background="white" padding={5}>
        <Text fontSize="lg">Utilized capacity</Text>
        <Progress size="xs" value={capacityValue} />
        <Text as="span" fontSize="xs" color="gray.600" fontWeight={500}>
          {resourcePool.Capacity?.freeCapacity ?? 0} / {totalCapacity}
        </Text>
      </Box>

      <Box mt={10}>
        <Heading size="lg">Allocated Resources</Heading>
        <PoolDetailTable allocatedResources={resourcePool.allocatedResources as ResourceConnection} />
      </Box>
    </PageContainer>
  );
};

export default PoolDetailPage;
