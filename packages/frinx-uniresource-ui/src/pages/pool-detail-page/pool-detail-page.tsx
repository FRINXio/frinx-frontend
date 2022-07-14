import { Box, Button, ButtonGroup, Flex, Heading, Progress, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageContainer from '../../components/page-container';
import { omitNullValue } from '../../helpers/omit-null-value';
import useResourcePoolActions from '../../hooks/use-resource-pool-actions';
import { GetPoolsQuery, PoolCapacityPayload } from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';
import { ClaimAddressModal } from './claim-address-modal';
import ClaimResourceModal from './claim-resource-modal/claim-resource-modal';
import PoolDetailAllocatingTable from './pool-detail-allocating-table';
import PoolDetailSetSingletonTable from './pool-detail-set_singleton-table';

export type PoolResource = {
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
};

function getTotalCapacity(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  return Number(capacity.freeCapacity) + Number(capacity.utilizedCapacity);
}
function getCapacityValue(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  const totalCapacity = getTotalCapacity(capacity);
  if (totalCapacity === 0) {
    return 0;
  }
  return (Number(capacity.utilizedCapacity) / totalCapacity) * 100;
}

const PoolDetailPage: VoidFunctionComponent = () => {
  const { poolId } = useParams<{ poolId: string }>();

  const claimResourceModal = useDisclosure();
  const claimAddressModal = useDisclosure();

  const [
    {
      poolDetail: { data: poolData, fetching: isLoadingPool },
      allocatedResources: { data: allocatedResources, fetching: isLoadingResources },
      resourceTypes: { fetching: isLoadingResourceTypes },
      paginationArgs,
    },
    { claimPoolResource, freePoolResource, deleteResourcePool, handleOnClaimAddress, nextPage, previousPage },
  ] = useResourcePoolActions({ poolId });

  if (poolId == null) {
    return null;
  }

  if (isLoadingPool || isLoadingResources || isLoadingResourceTypes) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (poolData == null || poolData.QueryResourcePool == null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const { QueryResourcePool: resourcePool } = poolData;
  const capacityValue = getCapacityValue(resourcePool.Capacity);
  const totalCapacity = getTotalCapacity(resourcePool.Capacity);
  const nestedPools: GetPoolsQuery['QueryRootResourcePools'] = resourcePool.Resources.map((resource) =>
    resource.NestedPool !== null ? resource.NestedPool : null,
  ).filter(omitNullValue);
  const canClaimResources =
    resourcePool.Capacity != null &&
    Number(resourcePool.Capacity.freeCapacity) > 0 &&
    Number(resourcePool.Capacity.freeCapacity) <= totalCapacity;
  const canFreeResource = resourcePool.Capacity != null && Number(resourcePool.Capacity.freeCapacity) !== totalCapacity;
  const canCreateNestedPool =
    resourcePool.Resources.length > resourcePool.Resources.filter((resource) => resource.NestedPool != null).length;
  const isAllocating = /(ipv4_prefix|ipv6_prefix|vlan_range)/.test(resourcePool.ResourceType.Name);

  return (
    <PageContainer>
      <ClaimResourceModal
        isOpen={claimResourceModal.isOpen}
        onClose={claimResourceModal.onClose}
        onClaim={claimPoolResource}
        poolName={resourcePool.Name}
        variant={resourcePool.ResourceType.Name}
      />
      {isAllocating && (
        <ClaimAddressModal
          isCentered
          isOpen={claimAddressModal.isOpen}
          onClose={claimAddressModal.onClose}
          resourceProperties={resourcePool.PoolProperties}
          onClaimAddress={(formValues) => handleOnClaimAddress(poolId, formValues)}
        />
      )}
      <Flex alignItems="center">
        <Heading as="h1" size="lg" mb={6}>
          {resourcePool.Name}
        </Heading>
        <Spacer />
        {isAllocating && (
          <Box>
            <ButtonGroup>
              <Button
                onClick={claimResourceModal.onOpen}
                colorScheme="blue"
                variant="outline"
                isDisabled={!canClaimResources}
              >
                Claim resource
              </Button>
              <Button
                onClick={claimAddressModal.onOpen}
                colorScheme="blue"
                variant="solid"
                isDisabled={!canClaimResources}
              >
                Claim address
              </Button>
            </ButtonGroup>
          </Box>
        )}
      </Flex>

      <Box background="white" padding={5}>
        <Text fontSize="lg">Utilized capacity</Text>
        <Progress size="xs" value={capacityValue} />
        <Text as="span" fontSize="xs" color="gray.600" fontWeight={500}>
          {resourcePool.Capacity?.freeCapacity ?? 0} / {totalCapacity}
        </Text>
      </Box>

      <Box my={10}>
        <Heading size="md" mb={5}>
          Allocated Resources
        </Heading>
        {resourcePool.PoolType === 'allocating' && (
          <PoolDetailAllocatingTable
            allocatedResources={allocatedResources?.QueryResources}
            onFreeResource={freePoolResource}
            canFreeResource={canFreeResource}
            onNext={nextPage}
            onPrevious={previousPage}
            paginationArgs={paginationArgs}
          />
        )}
        {(resourcePool.PoolType === 'set' || resourcePool.PoolType === 'singleton') && (
          <PoolDetailSetSingletonTable
            resources={resourcePool.Resources}
            allocatedResources={allocatedResources?.QueryResources}
            onFreeResource={freePoolResource}
            onClaimResource={claimPoolResource}
            onNext={nextPage}
            onPrevious={previousPage}
            paginationArgs={paginationArgs}
          />
        )}
      </Box>

      <Box my={10}>
        <Flex>
          <Heading size="md" mb={5}>
            Nested Pools
          </Heading>
          <Spacer />
          {canCreateNestedPool && (
            <Button colorScheme="blue" as={Link} to={`../pools/new?parentPoolId=${poolId}&isNested=true`}>
              Create nested pool
            </Button>
          )}
        </Flex>
        <PoolsTable pools={nestedPools} isLoading={isLoadingPool} onDeleteBtnClick={deleteResourcePool} />
      </Box>
    </PageContainer>
  );
};

export default PoolDetailPage;
