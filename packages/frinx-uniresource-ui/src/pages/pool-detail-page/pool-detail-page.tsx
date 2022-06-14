import { Box, Button, ButtonGroup, Flex, Heading, Progress, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import PageContainer from '../../components/page-container';
import { omitNullValue } from '../../helpers/omit-null-value';
import unwrap from '../../helpers/unwrap';
import useNotifications from '../../hooks/use-notifications';
import { usePagination } from '../../hooks/use-pagination';
import {
  AllocatedResourcesQuery,
  AllocatedResourcesQueryVariables,
  ClaimAddressMutation,
  ClaimAddressMutationVariables,
  ClaimResourceMutation,
  ClaimResourceMutationVariables,
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  FreeResourceMutationMutation,
  FreeResourceMutationMutationVariables,
  GetAllPoolsQuery,
  GetPoolDetailQuery,
  GetPoolDetailQueryVariables,
  GetResourceTypeByNameQuery,
  GetResourceTypeByNameQueryVariables,
  PoolCapacityPayload,
} from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';
import { ClaimAddressModal } from './claim-address-modal';
import ClaimResourceModal from './claim-resource-modal/claim-resource-modal';
import PoolDetailAllocatingTable from './pool-detail-allocating-table';
import PoolDetailSetSingletonTable from './pool-detail-set_singleton-table';

export type PoolResource = {
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int' | 'string'>;
};

const POOL_DETAIL_QUERY = gql`
  query GetPoolDetail($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
      id
      Name
      PoolType
      PoolProperties
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
  query AllocatedResources($poolId: ID!, $first: Int, $last: Int, $before: String, $after: String) {
    QueryResources(poolId: $poolId, first: $first, last: $last, before: $before, after: $after) {
      edges {
        node {
          id
          Properties
          Description
        }
      }
      pageInfo {
        startCursor {
          ID
        }
        endCursor {
          ID
        }
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

const GET_RESOURCE_TYPE_BYNAME_QUERY = gql`
  query GetResourceTypeByName {
    QueryResourceTypes {
      id
      Name
    }
  }
`;

const CLAIM_ADDRESS_MUTATION = gql`
  mutation ClaimAddress($input: CreateNestedSetPoolInput!) {
    CreateNestedSetPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

const CLAIM_RESOURCES_MUTATION = gql`
  mutation ClaimResource($poolId: ID!, $description: String, $userInput: Map!) {
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

function getResourceTypeId(parentResourceTypeName: string, resourceTypes: Record<string, string>) {
  switch (parentResourceTypeName) {
    case 'ipv4_prefix':
      return resourceTypes.ipv4;
    case 'ipv6_prefix':
      return resourceTypes.ipv6;
    case 'vlan_range':
      return resourceTypes.vlan;
    default:
      throw new Error(`Unknown resource type: ${parentResourceTypeName}`);
  }
}

const PoolDetailPage: VoidFunctionComponent = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const allocatedResourcesContext = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);
  const mutationResourcesContext = useMemo(() => ({ additionalTypenames: ['Resource', 'ResourcePool'] }), []);

  const claimResourceModal = useDisclosure();
  const claimAddressModal = useDisclosure();
  const { addToastNotification } = useNotifications();

  const [{ data: poolData, fetching: isLoadingPool }] = useQuery<GetPoolDetailQuery, GetPoolDetailQueryVariables>({
    query: POOL_DETAIL_QUERY,
    variables: { poolId: unwrap(poolId) },
  });
  const [{ data: resourceTypes, fetching: isLoadingResourceTypes }] = useQuery<
    GetResourceTypeByNameQuery,
    GetResourceTypeByNameQueryVariables
  >({
    query: GET_RESOURCE_TYPE_BYNAME_QUERY,
  });

  const [paginationArgs, { nextPage, previousPage }] = usePagination();
  const [{ data: allocatedResources, fetching: isLoadingResources }] = useQuery<
    AllocatedResourcesQuery,
    AllocatedResourcesQueryVariables
  >({
    query: POOL_RESOURCES_QUERY,
    variables: { poolId: unwrap(poolId), ...paginationArgs },
    context: allocatedResourcesContext,
  });

  const [, claimResource] = useMutation<ClaimResourceMutation, ClaimResourceMutationVariables>(
    CLAIM_RESOURCES_MUTATION,
  );
  const [, freeResource] = useMutation<FreeResourceMutationMutation, FreeResourceMutationMutationVariables>(
    FREE_RESOURCES_MUTATION,
  );
  const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);
  const [, claimAddress] = useMutation<ClaimAddressMutation, ClaimAddressMutationVariables>(CLAIM_ADDRESS_MUTATION);

  if (poolId == null) {
    return null;
  }

  const claimPoolResource = (description?: string | null, userInput: Record<string, string | number> = {}) => {
    claimResource(
      {
        poolId,
        userInput,
        ...(description != null && { description }),
      },
      mutationResourcesContext,
    )
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

  const handleOnClaimAddress = (formValues: { poolName: string; description: string }) => {
    if (poolData?.QueryResourcePool.ResourceType.id == null) {
      return addToastNotification({
        type: 'error',
        content: 'We could not claim address from subnet. Please try again later',
      });
    }

    try {
      const resourceTypesMap = resourceTypes?.QueryResourceTypes.reduce((acc, curr) => {
        acc[curr.Name] = curr.id;
        return acc;
      }, {} as Record<string, string>);
      const resourceTypeId = getResourceTypeId(poolData.QueryResourcePool.ResourceType.Name, unwrap(resourceTypesMap));

      if (resourceTypeId == null) {
        throw new Error('Could not find resource type id');
      }

      return claimResource(
        {
          poolId,
          userInput: {
            desiredSize: 2,
          },
          description: formValues.description,
        },
        mutationResourcesContext,
      )
        .then((createdResource) => {
          if (createdResource.error) {
            throw new Error(createdResource.error.message);
          }

          if (createdResource.data?.ClaimResource.id == null) {
            throw new Error('Resource was not allocated');
          }

          return claimAddress({
            input: {
              parentResourceId: createdResource.data.ClaimResource.id,
              poolDealocationSafetyPeriod: 0,
              poolName: formValues.poolName,
              poolValues: [
                {
                  address: createdResource.data.ClaimResource.Properties.address,
                },
              ],
              resourceTypeId,
              description: formValues.description,
            },
          })
            .then((response) => {
              if (response.error) {
                throw new Error(response.error.message);
              }

              addToastNotification({
                type: 'success',
                content: `Successfully claimed address ${createdResource.data?.ClaimResource.Properties.address}`,
              });
            })
            .catch((error) => {
              addToastNotification({
                type: 'error',
                content: error.message || 'There was a problem with claiming address from pool',
              });
            });
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } catch (error) {
      return addToastNotification({
        type: 'error',
        content: 'We could not claim address from subnet. Please try again later',
      });
    }
  };

  const freePoolResource = (userInput: Record<string, string | number>) => {
    freeResource(
      {
        poolId,
        input: userInput,
      },
      mutationResourcesContext,
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
    deletePool({ input: { resourcePoolId: id } }, mutationResourcesContext);
  };

  if (isLoadingPool || isLoadingResources || isLoadingResourceTypes) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (poolData == null || poolData.QueryResourcePool == null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const { QueryResourcePool: resourcePool } = poolData;
  const capacityValue = getCapacityValue(resourcePool.Capacity);
  const totalCapacity = getTotalCapacity(resourcePool.Capacity);
  const nestedPools: GetAllPoolsQuery['QueryRootResourcePools'] = resourcePool.Resources.map((resource) =>
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
          onClaimAddress={handleOnClaimAddress}
        />
      )}
      <Flex alignItems="center">
        <Heading size="3xl" as="h2" mb={6}>
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
        <Heading size="lg" mb={5}>
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
          <Heading size="lg" mb={5}>
            Nested Pools
          </Heading>
          <Spacer />
          {canCreateNestedPool && (
            <Button colorScheme="blue" as={Link} to={`../pools/new?parentPoolId=${poolId}&isNested=true`}>
              Create nested pool
            </Button>
          )}
        </Flex>
        <PoolsTable pools={nestedPools} isLoading={isLoadingPool} onDeleteBtnClick={handleDeleteBtnClick} />
      </Box>
    </PageContainer>
  );
};

export default PoolDetailPage;
