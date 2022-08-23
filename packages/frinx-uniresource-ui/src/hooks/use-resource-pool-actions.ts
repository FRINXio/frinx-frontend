import { useNotifications, unwrap } from '@frinx/shared/src';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery, UseQueryState } from 'urql';
import {
  ClaimResourceMutation,
  ClaimResourceMutationVariables,
  FreeResourceMutationMutation,
  FreeResourceMutationMutationVariables,
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  GetResourceTypeByNameQuery,
  AllocatedResourcesQuery,
  AllocatedResourcesQueryVariables,
  GetPoolDetailQuery,
  GetPoolDetailQueryVariables,
  GetResourceTypeByNameQueryVariables,
  Exact,
  InputMaybe,
  ClaimResourceWithAltIdMutation,
  ClaimResourceWithAltIdMutationVariables,
} from '../__generated__/graphql';
import { CallbackFunctions, PaginationArgs, usePagination } from './use-pagination';

export type AlternativeIdValue = string | number | (string | number)[];

export type ResourcePoolActionData = {
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
};

export type ResourcePoolActionHandlers = {
  claimPoolResource: (description?: string | null, userInput?: Record<string, string | number>) => void;
  claimPoolResourceWithAltId: (
    alternativeId: Record<string, AlternativeIdValue>,
    description?: string | null,
    userInput?: Record<string, string | number>,
  ) => void;
  freePoolResource: (userInput: Record<string, string | number>) => void;
  deleteResourcePool: (id: string, options?: { redirectOnSuccess?: string; redirectOnError?: string }) => void;
} & CallbackFunctions;

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
          NestedPool {
            id
            Name
          }
          AlternativeId
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

const CLAIM_RESOURCES_MUTATION = gql`
  mutation ClaimResource($poolId: ID!, $description: String, $userInput: Map!) {
    ClaimResource(poolId: $poolId, description: $description, userInput: $userInput) {
      id
      Properties
    }
  }
`;

const CLAIM_RESOURCES_WITH_ALT_ID_MUTATION = gql`
  mutation ClaimResourceWithAltId($poolId: ID!, $description: String, $userInput: Map!, $alternativeId: Map!) {
    ClaimResourceWithAltId(
      poolId: $poolId
      description: $description
      userInput: $userInput
      alternativeId: $alternativeId
    ) {
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

const useResourcePoolActions = ({
  poolId,
}: {
  poolId?: string;
}): [ResourcePoolActionData, ResourcePoolActionHandlers] => {
  const { addToastNotification } = useNotifications();
  const mutationResourcesContext = useMemo(() => ({ additionalTypenames: ['Resource', 'ResourcePool'] }), []);
  const allocatedResourcesContext = useMemo(() => ({ additionalTypenames: ['Resource'] }), []);
  const navigate = useNavigate();

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
  const [, claimResourceWithAltId] = useMutation<
    ClaimResourceWithAltIdMutation,
    ClaimResourceWithAltIdMutationVariables
  >(CLAIM_RESOURCES_WITH_ALT_ID_MUTATION);
  const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);

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
      claimPoolResourceWithAltId: (
        alternativeId: Record<string, string | number | (string | number)[]>,
        description?: string | null,
        userInput: Record<string, string | number> = {},
      ) => {
        claimResourceWithAltId(
          {
            alternativeId,
            poolId: poolId || '',
            userInput,
            description,
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

      deleteResourcePool: (id: string, options?: { redirectOnSuccess?: string; redirectOnError?: string }) => {
        deletePool({ input: { resourcePoolId: id } }, mutationResourcesContext)
          .then(({ error }) => {
            if (error) {
              throw error;
            }

            addToastNotification({
              type: 'success',
              content: 'Successfully deleted resource pool',
            });

            if (options?.redirectOnSuccess) {
              navigate(options.redirectOnSuccess);
            }
          })
          .catch((error) => {
            addToastNotification({
              type: 'error',
              content: error.message || 'There was a problem with deleting resource pool',
            });

            if (options?.redirectOnError) {
              navigate(options.redirectOnError);
            }
          });
      },
    }),
    [
      addToastNotification,
      poolId,
      claimResource,
      claimResourceWithAltId,
      freeResource,
      mutationResourcesContext,
      deletePool,
      reloadAllocatedResources,
      navigate,
    ],
  );

  return [
    { poolDetail, allocatedResources, resourceTypes, paginationArgs },
    { ...handlers, ...pageHandlers },
  ];
};

export default useResourcePoolActions;
