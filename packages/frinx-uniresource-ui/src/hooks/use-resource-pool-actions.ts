import { useNotifications } from '@frinx/shared/src';
import { useMemo } from 'react';
import { gql, useMutation, useQuery, UseQueryState } from 'urql';
import unwrap from '../helpers/unwrap';
import {
  ClaimResourceMutation,
  ClaimResourceMutationVariables,
  FreeResourceMutationMutation,
  FreeResourceMutationMutationVariables,
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  ClaimAddressMutation,
  ClaimAddressMutationVariables,
  GetResourceTypeByNameQuery,
  AllocatedResourcesQuery,
  AllocatedResourcesQueryVariables,
  GetPoolDetailQuery,
  GetPoolDetailQueryVariables,
  GetResourceTypeByNameQueryVariables,
  Exact,
  InputMaybe,
} from '../__generated__/graphql';
import { CallbackFunctions, PaginationArgs, usePagination } from './use-pagination';

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
              ResourceType {
                id
                Name
              }
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

const useResourcePoolActions = ({
  poolId,
}: {
  poolId?: string;
}): [
  {
    poolDetail: UseQueryState<
      GetPoolDetailQuery,
      Exact<{
        poolId: string;
      }>
    >;
    allocatedResources: UseQueryState<
      AllocatedResourcesQuery,
      Exact<{
        poolId: string;
        first?: InputMaybe<number> | undefined;
        last?: InputMaybe<number> | undefined;
        before?: InputMaybe<string> | undefined;
        after?: InputMaybe<string> | undefined;
      }>
    >;
    resourceTypes: UseQueryState<
      GetResourceTypeByNameQuery,
      Exact<{
        [key: string]: never;
      }>
    >;
    paginationArgs: PaginationArgs;
  },
  {
    claimPoolResource: (description?: string | null, userInput?: Record<string, string | number>) => void;
    handleOnClaimAddress: (id: string, formValues: { poolName: string; description: string }) => void | Promise<void>;
    freePoolResource: (userInput: Record<string, string | number>) => void;
    deleteResourcePool: (id: string) => void;
  } & CallbackFunctions,
] => {
  const { addToastNotification } = useNotifications();
  const mutationResourcesContext = useMemo(() => ({ additionalTypenames: ['Resource', 'ResourcePool'] }), []);
  const allocatedResourcesContext = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);

  const [poolDetail] = useQuery<GetPoolDetailQuery, GetPoolDetailQueryVariables>({
    query: POOL_DETAIL_QUERY,
    variables: { poolId: unwrap(poolId) },
  });
  const [resourceTypes] = useQuery<GetResourceTypeByNameQuery, GetResourceTypeByNameQueryVariables>({
    query: GET_RESOURCE_TYPE_BYNAME_QUERY,
  });

  const [paginationArgs, pageHandlers] = usePagination();
  const [allocatedResources, reloadAllocatedResources] = useQuery<
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

  const handlers = useMemo(
    () => ({
      claimPoolResource: (description?: string | null, userInput: Record<string, string | number> = {}) => {
        claimResource(
          {
            poolId: poolId || '',
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

            reloadAllocatedResources();
          })
          .catch((error) => {
            addToastNotification({
              type: 'error',
              content: error.message || 'There was a problem with claiming resource from pool',
            });
          });
      },

      handleOnClaimAddress: (id: string, formValues: { poolName: string; description: string }) => {
        if (poolDetail.data?.QueryResourcePool.ResourceType.id == null) {
          return addToastNotification({
            type: 'error',
            content: 'We could not claim address from subnet. Please try again later',
          });
        }

        try {
          const resourceTypesMap = resourceTypes.data?.QueryResourceTypes.reduce((acc, curr) => {
            acc[curr.Name] = curr.id;
            return acc;
          }, {} as Record<string, string>);
          const resourceTypeId = getResourceTypeId(
            poolDetail.data.QueryResourcePool.ResourceType.Name,
            unwrap(resourceTypesMap),
          );

          if (resourceTypeId == null) {
            throw new Error('Could not find resource type id');
          }

          return claimResource(
            {
              poolId: id,
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
      },

      freePoolResource: (userInput: Record<string, string | number>) => {
        freeResource(
          {
            poolId: poolId || '',
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
      },

      deleteResourcePool: (id: string) => {
        deletePool({ input: { resourcePoolId: id } }, mutationResourcesContext);
      },
    }),
    [
      addToastNotification,
      poolId,
      claimAddress,
      claimResource,
      freeResource,
      mutationResourcesContext,
      deletePool,
      poolDetail,
      resourceTypes,
      reloadAllocatedResources,
    ],
  );

  return [
    { poolDetail, allocatedResources, resourceTypes, paginationArgs },
    { ...handlers, ...pageHandlers },
  ];
};

export default useResourcePoolActions;
