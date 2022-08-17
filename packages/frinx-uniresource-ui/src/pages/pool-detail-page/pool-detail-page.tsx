import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Progress,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { omitNullValue } from '@frinx/shared/src';
import React, { VoidFunctionComponent } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageContainer from '../../components/page-container';
import useResourcePoolActions from '../../hooks/use-resource-pool-actions';
import { GetPoolsQuery, PoolCapacityPayload } from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';
import ClaimResourceModal from './claim-resource-modal/claim-resource-modal';
import ClaimRouteDistinguisherResourceModal from './claim-resource-modal/claim-route_distinguisher-resource-modal';
import PoolDetailAllocatingTable from './pool-detail-allocating-table';
import PoolDetailSetSingletonTable from './pool-detail-set_singleton-table';

export type PoolResource = {
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
};

function getTotalCapacity(capacity: PoolCapacityPayload | null): bigint {
  if (capacity == null) {
    return 0n;
  }
  return BigInt(capacity.freeCapacity) + BigInt(capacity.utilizedCapacity);
}

const PoolDetailPage: VoidFunctionComponent = () => {
  const { poolId } = useParams<{ poolId: string }>();

  const claimResourceModal = useDisclosure();
  const claimRouteDistinguisherResourceModal = useDisclosure();

  const [
    {
      poolDetail: { data: poolData, fetching: isLoadingPool },
      allocatedResources: { data: allocatedResources, fetching: isLoadingResources },
      resourceTypes: { fetching: isLoadingResourceTypes },
      paginationArgs,
    },
    { claimPoolResource, freePoolResource, deleteResourcePool, nextPage, previousPage, claimPoolResourceWithAltId },
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

  const handleOnOpenClaimResourceModal = () => {
    if (poolData.QueryResourcePool.ResourceType.Name === 'route_distinguisher') {
      claimRouteDistinguisherResourceModal.onOpen();
    } else {
      claimResourceModal.onOpen();
    }
  };

  const { QueryResourcePool: resourcePool } = poolData;
  const totalCapacity = getTotalCapacity(resourcePool.Capacity);
  const nestedPools: GetPoolsQuery['QueryRootResourcePools'] = resourcePool.Resources.map((resource) =>
    resource.NestedPool !== null ? resource.NestedPool : null,
  ).filter(omitNullValue);
  const canClaimResources =
    resourcePool.Capacity != null &&
    BigInt(resourcePool.Capacity.freeCapacity) > 0n &&
    BigInt(resourcePool.Capacity.freeCapacity) <= totalCapacity;
  const isPrefixOrRange =
    resourcePool.ResourceType.Name === 'ipv4_prefix' ||
    resourcePool.ResourceType.Name === 'ipv6_prefix' ||
    resourcePool.ResourceType.Name === 'vlan_range' ||
    resourcePool.ResourceType.Name === 'route_distinguisher';
  const canCreateNestedPool = resourcePool.Resources.some((resource) => resource.NestedPool == null) && isPrefixOrRange;
  const isAllocating = resourcePool.PoolType === 'allocating';
  const canDeletePool = resourcePool.Resources.length === 0;

  return (
    <PageContainer>
      <ClaimRouteDistinguisherResourceModal
        isOpen={claimRouteDistinguisherResourceModal.isOpen}
        onClose={claimRouteDistinguisherResourceModal.onClose}
        poolName={resourcePool.Name}
        onClaimWithAltId={claimPoolResourceWithAltId}
      />
      <ClaimResourceModal
        isOpen={claimResourceModal.isOpen}
        onClose={claimResourceModal.onClose}
        onClaimWithAltId={claimPoolResourceWithAltId}
        poolName={resourcePool.Name}
        resourceTypeName={resourcePool.ResourceType.Name}
        totalCapacity={totalCapacity}
        poolProperties={resourcePool.PoolProperties}
      />
      <HStack mb={5}>
        <Heading as="h1" size="lg">
          {resourcePool.Name}
        </Heading>
        <Spacer />
        {isAllocating && (
          <Button
            onClick={handleOnOpenClaimResourceModal}
            colorScheme="blue"
            variant="solid"
            isDisabled={!canClaimResources}
          >
            Claim resource
          </Button>
        )}
      </HStack>

      <Box background="white" padding={5}>
        <Text fontSize="lg">Utilized capacity</Text>
        <Progress
          size="xs"
          value={Number((BigInt(resourcePool.Capacity?.utilizedCapacity ?? 0n) * 100n) / totalCapacity)}
        />
        <Text as="span" fontSize="xs" color="gray.600" fontWeight={500}>
          {resourcePool.Capacity?.freeCapacity ?? 0} / {totalCapacity.toString()}
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

      {isPrefixOrRange ? (
        <Box my={10}>
          <HStack mb={5}>
            <Heading size="md">Nested Pools</Heading>
            <Spacer />
            {canCreateNestedPool && (
              <Button colorScheme="blue" as={Link} to={`../pools/new?parentPoolId=${poolId}&isNested=true`}>
                Create nested pool
              </Button>
            )}
          </HStack>
          <PoolsTable pools={nestedPools} isLoading={isLoadingPool} onDeleteBtnClick={deleteResourcePool} />
        </Box>
      ) : (
        <Box textAlign="center">This pool cannot have nested pools</Box>
      )}

      <Box my={5} border="1px" borderColor="gray.300" borderRadius="md" bgColor="white" padding={5}>
        <Heading textColor="red.500" size="md">
          Danger zone
        </Heading>
        <Text size="xs" textColor="gray.400">
          Delete resource pool
        </Text>
        <Divider my={3} />
        <Text size="sm" textColor="gray.400">
          <strong>Warning:</strong> By deleting this pool, all data will be lost.
        </Text>
        {canDeletePool ? (
          <Popover placement="right">
            <PopoverTrigger>
              <Button mt={5} variant="outline" colorScheme="red">
                Delete resource pool
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Are you sure you want to delete this pool?</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody mx="auto">
                  <Button
                    colorScheme="red"
                    onClick={() => deleteResourcePool(poolId, { redirectOnSuccess: '/uniresource/pools' })}
                  >
                    Yes, delete this resource pool
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ) : (
          <Tooltip label="Firstly you need to delete all allocated resources" shouldWrapChildren>
            <Button mt={5} variant="outline" colorScheme="red" isDisabled>
              Delete resource pool
            </Button>
          </Tooltip>
        )}
      </Box>
    </PageContainer>
  );
};

export default PoolDetailPage;
