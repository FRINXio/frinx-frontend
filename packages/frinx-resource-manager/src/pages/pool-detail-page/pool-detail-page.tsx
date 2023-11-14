import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Progress,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import DeleteModal from '../../components/delete-modal';
import PageContainer from '../../components/page-container';
import { isCustomResourceType } from '../../helpers/create-pool-form.helpers';
import { getTotalCapacity } from '../../helpers/resource-pool.helpers';
import useResourcePoolActions, { AlternativeIdValue } from '../../hooks/use-resource-pool-actions';
import ClaimCustomResourceModal from './claim-resource-modal/claim-custom-resource-modal';
import ClaimResourceModal from './claim-resource-modal/claim-resource-modal';
import ClaimRouteDistinguisherResourceModal from './claim-resource-modal/claim-route_distinguisher-resource-modal';
import PoolDetailAllocatedResourceBox from './pool-detail-allocated-resources-box';
import PoolDetailNestedPoolsTable from './pool-detail-nested-pools-table';

export type PoolResource = {
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
};

const PoolDetailPage: VoidFunctionComponent = () => {
  const { poolId } = useParams<{ poolId: string }>();

  const claimResourceModal = useDisclosure();
  const claimRouteDistinguisherResourceModal = useDisclosure();
  const claimCustomResourceModal = useDisclosure();

  const [
    {
      poolDetail: { data: poolData, fetching: isLoadingPool },
      allocatedResources: { data: allocatedResources, fetching: isLoadingResources },
      paginationArgs,
    },
    {
      claimPoolResource,
      freePoolResource,
      deleteResourcePool,
      nextPage,
      previousPage,
      claimPoolResourceWithAltId,
      handleAlternativeIdsChange,
    },
  ] = useResourcePoolActions({ poolId });

  if (poolId == null) {
    return <Center>The pool identifier is missing in the URL</Center>;
  }

  if (isLoadingPool) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (poolData == null || poolData.resourceManager.QueryResourcePool == null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const handleOnOpenClaimResourceModal = () => {
    if (isCustomResourceType(poolData.resourceManager.QueryResourcePool.ResourceType.Name)) {
      claimCustomResourceModal.onOpen();
    } else if (poolData.resourceManager.QueryResourcePool.ResourceType.Name === 'route_distinguisher') {
      claimRouteDistinguisherResourceModal.onOpen();
    } else {
      claimResourceModal.onOpen();
    }
  };

  const handleClaimResource = (
    alternativeId: Record<string, AlternativeIdValue>,
    description?: string | null,
    userInput?: Record<string, string | number>,
  ) => {
    if (Object.keys(alternativeId).length > 0) {
      claimPoolResourceWithAltId(alternativeId, description, userInput);
    } else {
      claimPoolResource(description, userInput);
    }
  };

  const {
    resourceManager: { QueryResourcePool: resourcePool },
  } = poolData;
  const totalCapacity = getTotalCapacity(resourcePool.Capacity);
  const freeCapacity = BigInt(Number(resourcePool.Capacity?.freeCapacity));
  const canClaimResources =
    (resourcePool.Capacity != null && freeCapacity > 0n && freeCapacity <= totalCapacity) || totalCapacity < 2;
  const isAllocating = resourcePool.PoolType === 'allocating';
  const canDeletePool = resourcePool.Resources.length === 0;
  const progressValue =
    totalCapacity === 0n ? 100 : Number((BigInt(resourcePool.Capacity?.utilizedCapacity ?? 0n) * 100n) / totalCapacity);

  return (
    <PageContainer>
      <ClaimCustomResourceModal
        poolName={resourcePool.Name}
        isOpen={claimCustomResourceModal.isOpen}
        onClose={claimCustomResourceModal.onClose}
        onClaimWithAltId={handleClaimResource}
      />
      <ClaimRouteDistinguisherResourceModal
        isOpen={claimRouteDistinguisherResourceModal.isOpen}
        onClose={claimRouteDistinguisherResourceModal.onClose}
        poolName={resourcePool.Name}
        onClaimWithAltId={handleClaimResource}
      />
      <ClaimResourceModal
        isOpen={claimResourceModal.isOpen}
        onClose={claimResourceModal.onClose}
        onClaimWithAltId={handleClaimResource}
        poolName={resourcePool.Name}
        resourceTypeName={resourcePool.ResourceType.Name}
        totalCapacity={totalCapacity}
        poolProperties={resourcePool.PoolProperties}
      />
      <HStack mb={5}>
        <Heading as="h1" size="xl">
          {resourcePool.Name}
        </Heading>
        <Spacer />
        {isAllocating && (
          <Button
            data-cy="resource-pool-claim-resource"
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
        <Progress size="xs" value={progressValue} />
        <Text as="span" fontSize="xs" color="gray.600" fontWeight={500}>
          {freeCapacity.toString() ?? 0} / {totalCapacity.toString()}
        </Text>
      </Box>

      <Box background="white" padding={5} marginTop={5}>
        <Text fontSize="lg" marginBottom={5}>
          Pool properties
        </Text>
        <Table background="white" size="sm">
          <Thead bgColor="gray.200">
            <Tr>
              <Th>Property</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(resourcePool.PoolProperties).map((entry) => {
              return (
                <Tr key={entry}>
                  <Td width="50%">{entry}</Td>
                  <Td width="50%">{resourcePool.PoolProperties[entry].toString()}</Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot />
        </Table>
      </Box>

      <PoolDetailAllocatedResourceBox
        allocatedResources={allocatedResources}
        claimPoolResource={claimPoolResource}
        freePoolResource={freePoolResource}
        handleAlternativeIdsChange={handleAlternativeIdsChange}
        isLoadingResources={isLoadingResources}
        pagination={{ nextPage, previousPage, paginationArgs }}
        resourcePool={resourcePool}
      />

      <PoolDetailNestedPoolsTable
        deleteResourcePool={deleteResourcePool}
        isLoadingPool={isLoadingPool}
        resourcePool={resourcePool}
        poolId={poolId}
      />

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
        <DeleteModal
          type="resource pool"
          onDelete={() => deleteResourcePool(poolId, { redirectOnSuccess: '/resource-manager/pools' })}
          canDeletePool={canDeletePool}
          entityName={resourcePool.Name}
        >
          <Button data-cy="delete-resource-pool" mt={5} variant="outline" colorScheme="red" isDisabled={!canDeletePool}>
            Delete resource pool
          </Button>
        </DeleteModal>
      </Box>
    </PageContainer>
  );
};

export default PoolDetailPage;
