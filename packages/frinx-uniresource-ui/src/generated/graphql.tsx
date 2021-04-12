import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Represents data-type where variable keys and values can be used */
  Map: any;
};

/** Represents an allocation strategy */
export type AllocationStrategy = Node & {
  __typename?: 'AllocationStrategy';
  Description?: Maybe<Scalars['String']>;
  Lang: AllocationStrategyLang;
  Name: Scalars['String'];
  Script: Scalars['String'];
  id: Scalars['ID'];
};

/** Supported languages for allocation strategy scripts */
export enum AllocationStrategyLang {
  Js = 'js',
  Py = 'py',
}

/** Input parameters for creating an allocation pool */
export type CreateAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  poolProperties: Scalars['Map'];
  poolPropertyTypes: Scalars['Map'];
  resourceTypeId: Scalars['ID'];
  tags?: Maybe<Array<Scalars['String']>>;
};

/** Output of creating an allocating pool */
export type CreateAllocatingPoolPayload = {
  __typename?: 'CreateAllocatingPoolPayload';
  pool?: Maybe<ResourcePool>;
};

/** Input parameters for creating a new allocation strategy */
export type CreateAllocationStrategyInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  script: Scalars['String'];
  lang: AllocationStrategyLang;
};

/** Output of creating a new allocation strategy */
export type CreateAllocationStrategyPayload = {
  __typename?: 'CreateAllocationStrategyPayload';
  strategy?: Maybe<AllocationStrategy>;
};

/** Input parameters for creating a nested allocation pool */
export type CreateNestedAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  parentResourceId: Scalars['ID'];
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  resourceTypeId: Scalars['ID'];
  tags?: Maybe<Array<Scalars['String']>>;
};

/** Output of creating a nested allocating pool */
export type CreateNestedAllocatingPoolPayload = {
  __typename?: 'CreateNestedAllocatingPoolPayload';
  pool?: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested set pool */
export type CreateNestedSetPoolInput = {
  description?: Maybe<Scalars['String']>;
  parentResourceId: Scalars['ID'];
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  poolValues: Array<Maybe<Scalars['Map']>>;
  resourceTypeId: Scalars['ID'];
  tags?: Maybe<Array<Scalars['String']>>;
};

/** Output of creating a nested set pool */
export type CreateNestedSetPoolPayload = {
  __typename?: 'CreateNestedSetPoolPayload';
  pool?: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested singleton pool */
export type CreateNestedSingletonPoolInput = {
  description?: Maybe<Scalars['String']>;
  parentResourceId: Scalars['ID'];
  poolName: Scalars['String'];
  poolValues: Array<Maybe<Scalars['Map']>>;
  resourceTypeId: Scalars['ID'];
  tags?: Maybe<Array<Scalars['String']>>;
};

/** Output of creating a nested singleton pool */
export type CreateNestedSingletonPoolPayload = {
  __typename?: 'CreateNestedSingletonPoolPayload';
  pool?: Maybe<ResourcePool>;
};

/** Creating a new resource-type */
export type CreateResourceTypeInput = {
  /** name of the resource type AND property type (should they be different?) */
  resourceName: Scalars['String'];
  /**
   * resourceProperties: Map! - for key "init" the value is the initial value of the property type (like 7)
   *                          - for key "type" the value is the name of the type like "int"
   */
  resourceProperties: Scalars['Map'];
};

/** Output of creating a new resource-type */
export type CreateResourceTypePayload = {
  __typename?: 'CreateResourceTypePayload';
  resourceType: ResourceType;
};

/** Input parameters for creating a set pool */
export type CreateSetPoolInput = {
  description?: Maybe<Scalars['String']>;
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  poolValues: Array<Scalars['Map']>;
  resourceTypeId: Scalars['ID'];
  tags?: Maybe<Array<Scalars['String']>>;
};

/** Output of creating set pool */
export type CreateSetPoolPayload = {
  __typename?: 'CreateSetPoolPayload';
  pool?: Maybe<ResourcePool>;
};

/** Input parameters for creating a singleton pool */
export type CreateSingletonPoolInput = {
  description?: Maybe<Scalars['String']>;
  poolName: Scalars['String'];
  poolValues: Array<Scalars['Map']>;
  resourceTypeId: Scalars['ID'];
  tags?: Maybe<Array<Scalars['String']>>;
};

/** Output of creating a singleton pool */
export type CreateSingletonPoolPayload = {
  __typename?: 'CreateSingletonPoolPayload';
  pool?: Maybe<ResourcePool>;
};

/** Input parameters for creating a new tag */
export type CreateTagInput = {
  tagText: Scalars['String'];
};

/** Output of creating a tag */
export type CreateTagPayload = {
  __typename?: 'CreateTagPayload';
  tag?: Maybe<Tag>;
};

/** Input parameters for deleting an existing allocation strategy */
export type DeleteAllocationStrategyInput = {
  allocationStrategyId: Scalars['ID'];
};

/** Output of deleting an existing allocation strategy */
export type DeleteAllocationStrategyPayload = {
  __typename?: 'DeleteAllocationStrategyPayload';
  strategy?: Maybe<AllocationStrategy>;
};

/** Input entity for deleting a pool */
export type DeleteResourcePoolInput = {
  resourcePoolId: Scalars['ID'];
};

/** Output entity for deleting a pool */
export type DeleteResourcePoolPayload = {
  __typename?: 'DeleteResourcePoolPayload';
  resourcePoolId: Scalars['ID'];
};

/** Input parameters for deleting an existing resource-type */
export type DeleteResourceTypeInput = {
  resourceTypeId: Scalars['ID'];
};

/** Output of deleting a resource-type */
export type DeleteResourceTypePayload = {
  __typename?: 'DeleteResourceTypePayload';
  resourceTypeId: Scalars['ID'];
};

/** Input parameters for deleting an existing tag */
export type DeleteTagInput = {
  tagId: Scalars['ID'];
};

/** Output of deleting a tag */
export type DeleteTagPayload = {
  __typename?: 'DeleteTagPayload';
  tagId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateTag: CreateTagPayload;
  UpdateTag: UpdateTagPayload;
  DeleteTag: DeleteTagPayload;
  TagPool: TagPoolPayload;
  UntagPool: UntagPoolPayload;
  CreateAllocationStrategy: CreateAllocationStrategyPayload;
  DeleteAllocationStrategy: DeleteAllocationStrategyPayload;
  TestAllocationStrategy: Scalars['Map'];
  ClaimResource: Resource;
  FreeResource: Scalars['String'];
  CreateSetPool: CreateSetPoolPayload;
  CreateNestedSetPool: CreateNestedSetPoolPayload;
  CreateSingletonPool: CreateSingletonPoolPayload;
  CreateNestedSingletonPool: CreateNestedSingletonPoolPayload;
  CreateAllocatingPool: CreateAllocatingPoolPayload;
  CreateNestedAllocatingPool: CreateNestedAllocatingPoolPayload;
  DeleteResourcePool: DeleteResourcePoolPayload;
  CreateResourceType: CreateResourceTypePayload;
  DeleteResourceType: DeleteResourceTypePayload;
  UpdateResourceTypeName: UpdateResourceTypeNamePayload;
};

export type MutationCreateTagArgs = {
  input: CreateTagInput;
};

export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};

export type MutationDeleteTagArgs = {
  input: DeleteTagInput;
};

export type MutationTagPoolArgs = {
  input: TagPoolInput;
};

export type MutationUntagPoolArgs = {
  input: UntagPoolInput;
};

export type MutationCreateAllocationStrategyArgs = {
  input?: Maybe<CreateAllocationStrategyInput>;
};

export type MutationDeleteAllocationStrategyArgs = {
  input?: Maybe<DeleteAllocationStrategyInput>;
};

export type MutationTestAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID'];
  resourcePool: ResourcePoolInput;
  currentResources: Array<ResourceInput>;
  userInput: Scalars['Map'];
};

export type MutationClaimResourceArgs = {
  poolId: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  userInput: Scalars['Map'];
};

export type MutationFreeResourceArgs = {
  input: Scalars['Map'];
  poolId: Scalars['ID'];
};

export type MutationCreateSetPoolArgs = {
  input: CreateSetPoolInput;
};

export type MutationCreateNestedSetPoolArgs = {
  input: CreateNestedSetPoolInput;
};

export type MutationCreateSingletonPoolArgs = {
  input?: Maybe<CreateSingletonPoolInput>;
};

export type MutationCreateNestedSingletonPoolArgs = {
  input: CreateNestedSingletonPoolInput;
};

export type MutationCreateAllocatingPoolArgs = {
  input?: Maybe<CreateAllocatingPoolInput>;
};

export type MutationCreateNestedAllocatingPoolArgs = {
  input: CreateNestedAllocatingPoolInput;
};

export type MutationDeleteResourcePoolArgs = {
  input: DeleteResourcePoolInput;
};

export type MutationCreateResourceTypeArgs = {
  input: CreateResourceTypeInput;
};

export type MutationDeleteResourceTypeArgs = {
  input: DeleteResourceTypeInput;
};

export type MutationUpdateResourceTypeNameArgs = {
  input: UpdateResourceTypeNameInput;
};

/** Interface for entities needed by the relay-framework */
export type Node = {
  /** The ID of the entity */
  id: Scalars['ID'];
};

/** Holds the string value for pagination */
export type OutputCursor = {
  __typename?: 'OutputCursor';
  ID: Scalars['String'];
};

/** Entity representing capacity of a pool */
export type PoolCapacityPayload = {
  __typename?: 'PoolCapacityPayload';
  freeCapacity: Scalars['Float'];
  utilizedCapacity: Scalars['Float'];
};

/** A Relay-specific entity holding information about pagination */
export type ResourceConnection = {
  __typename?: 'ResourceConnection';
  edges: Array<Maybe<ResourceEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** Pools can be tagged for easier search */
export type Tag = Node & {
  __typename?: 'Tag';
  Pools?: Maybe<Array<Maybe<ResourcePool>>>;
  Tag: Scalars['String'];
  id: Scalars['ID'];
};

/** A Relay-specific entity that holds information about the requested pagination page */
export type ResourceEdge = {
  __typename?: 'ResourceEdge';
  cursor: OutputCursor;
  node: Resource;
};

/** Defines the type of the property */
export type PropertyType = Node & {
  __typename?: 'PropertyType';
  FloatVal: Scalars['Float'];
  IntVal: Scalars['Int'];
  Mandatory: Scalars['Boolean'];
  Name: Scalars['String'];
  StringVal: Scalars['String'];
  Type: Scalars['String'];
  id: Scalars['ID'];
};

/** Output of adding a specific tag to a pool */
export type TagPoolPayload = {
  __typename?: 'TagPoolPayload';
  tag?: Maybe<Tag>;
};

/** Input parameters for a call adding a tag to pool */
export type TagPoolInput = {
  tagId: Scalars['ID'];
  poolId: Scalars['ID'];
};

/** Convenience entity representing the identity of a pool in some calls */
export type ResourcePoolInput = {
  ResourcePoolName: Scalars['String'];
  poolProperties: Scalars['Map'];
};

/** Represents an allocated resource */
export type Resource = Node & {
  __typename?: 'Resource';
  Description?: Maybe<Scalars['String']>;
  NestedPool?: Maybe<ResourcePool>;
  ParentPool: ResourcePool;
  Properties: Scalars['Map'];
  id: Scalars['ID'];
};

/** Helper entities for tag search */
export type TagOr = {
  matchesAny: Array<TagAnd>;
};

/** Alternative representation of identity of a resource (i.e. alternative to resource ID) */
export type ResourceInput = {
  Properties: Scalars['Map'];
  Status: Scalars['String'];
  UpdatedAt: Scalars['String'];
};

/** Input parameters for a call removing a tag from pool */
export type UntagPoolInput = {
  tagId: Scalars['ID'];
  poolId: Scalars['ID'];
};

/** Output of updating the name of a resource-type */
export type UpdateResourceTypeNamePayload = {
  __typename?: 'UpdateResourceTypeNamePayload';
  resourceTypeId: Scalars['ID'];
};

/** Holds information about the requested pagination page */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: OutputCursor;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: OutputCursor;
};

/** Helper entities for tag search */
export type TagAnd = {
  matchesAll: Array<Scalars['String']>;
};

/** Output of removing a specific tag from a pool */
export type UntagPoolPayload = {
  __typename?: 'UntagPoolPayload';
  tag?: Maybe<Tag>;
};

/** Defines the type of pool */
export enum PoolType {
  Allocating = 'allocating',
  Set = 'set',
  Singleton = 'singleton',
}

/** Input parameters updating the name of a resource-type */
export type UpdateResourceTypeNameInput = {
  resourceTypeId: Scalars['ID'];
  resourceName: Scalars['String'];
};

/** Input parameters for updating an existing tag */
export type UpdateTagInput = {
  tagId: Scalars['ID'];
  tagText: Scalars['String'];
};

/** A pool is an entity that contains allocated and free resources */
export type ResourcePool = Node & {
  __typename?: 'ResourcePool';
  AllocationStrategy?: Maybe<AllocationStrategy>;
  Capacity?: Maybe<PoolCapacityPayload>;
  Name: Scalars['String'];
  ParentResource?: Maybe<Resource>;
  PoolProperties: Scalars['Map'];
  PoolType: PoolType;
  ResourceType: ResourceType;
  Resources: Array<Resource>;
  Tags: Array<Tag>;
  allocatedResources?: Maybe<ResourceConnection>;
  id: Scalars['ID'];
};

/** A pool is an entity that contains allocated and free resources */
export type ResourcePoolAllocatedResourcesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
};

/** Describes the properties of a resource */
export type ResourceType = Node & {
  __typename?: 'ResourceType';
  Name: Scalars['String'];
  Pools: Array<ResourcePool>;
  PropertyTypes: Array<PropertyType>;
  id: Scalars['ID'];
};

/** Output of updating a tag */
export type UpdateTagPayload = {
  __typename?: 'UpdateTagPayload';
  tag?: Maybe<Tag>;
};

export type Query = {
  __typename?: 'Query';
  QueryPoolCapacity: PoolCapacityPayload;
  QueryPoolTypes: Array<PoolType>;
  QueryResource: Resource;
  QueryResources: Array<Resource>;
  QueryAllocationStrategy: AllocationStrategy;
  QueryAllocationStrategies: Array<AllocationStrategy>;
  QueryResourceTypes: Array<ResourceType>;
  QueryResourcePool: ResourcePool;
  QueryResourcePools: Array<ResourcePool>;
  QueryResourcePoolHierarchyPath: Array<ResourcePool>;
  QueryRootResourcePools: Array<ResourcePool>;
  QueryLeafResourcePools: Array<ResourcePool>;
  SearchPoolsByTags: Array<ResourcePool>;
  QueryTags: Array<Tag>;
  node?: Maybe<Node>;
};

export type QueryQueryPoolCapacityArgs = {
  poolId: Scalars['ID'];
};

export type QueryQueryResourceArgs = {
  input: Scalars['Map'];
  poolId: Scalars['ID'];
};

export type QueryQueryResourcesArgs = {
  poolId: Scalars['ID'];
};

export type QueryQueryAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID'];
};

export type QueryQueryAllocationStrategiesArgs = {
  byName?: Maybe<Scalars['String']>;
};

export type QueryQueryResourceTypesArgs = {
  byName?: Maybe<Scalars['String']>;
};

export type QueryQueryResourcePoolArgs = {
  poolId: Scalars['ID'];
};

export type QueryQueryResourcePoolsArgs = {
  resourceTypeId?: Maybe<Scalars['ID']>;
  tags?: Maybe<TagOr>;
};

export type QueryQueryResourcePoolHierarchyPathArgs = {
  poolId: Scalars['ID'];
};

export type QueryQueryRootResourcePoolsArgs = {
  resourceTypeId?: Maybe<Scalars['ID']>;
  tags?: Maybe<TagOr>;
};

export type QueryQueryLeafResourcePoolsArgs = {
  resourceTypeId?: Maybe<Scalars['ID']>;
  tags?: Maybe<TagOr>;
};

export type QuerySearchPoolsByTagsArgs = {
  tags?: Maybe<TagOr>;
};

export type QueryNodeArgs = {
  id: Scalars['ID'];
};

import { IntrospectionQuery } from 'graphql';
export default ({
  __schema: {
    queryType: {
      name: 'Query',
    },
    mutationType: {
      name: 'Mutation',
    },
    subscriptionType: null,
    types: [
      {
        kind: 'OBJECT',
        name: 'AllocationStrategy',
        fields: [
          {
            name: 'Description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'Lang',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'Name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'Script',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'CreateAllocatingPoolPayload',
        fields: [
          {
            name: 'pool',
            type: {
              kind: 'OBJECT',
              name: 'ResourcePool',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateAllocationStrategyPayload',
        fields: [
          {
            name: 'strategy',
            type: {
              kind: 'OBJECT',
              name: 'AllocationStrategy',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateNestedAllocatingPoolPayload',
        fields: [
          {
            name: 'pool',
            type: {
              kind: 'OBJECT',
              name: 'ResourcePool',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateNestedSetPoolPayload',
        fields: [
          {
            name: 'pool',
            type: {
              kind: 'OBJECT',
              name: 'ResourcePool',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateNestedSingletonPoolPayload',
        fields: [
          {
            name: 'pool',
            type: {
              kind: 'OBJECT',
              name: 'ResourcePool',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateResourceTypePayload',
        fields: [
          {
            name: 'resourceType',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'ResourceType',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateSetPoolPayload',
        fields: [
          {
            name: 'pool',
            type: {
              kind: 'OBJECT',
              name: 'ResourcePool',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateSingletonPoolPayload',
        fields: [
          {
            name: 'pool',
            type: {
              kind: 'OBJECT',
              name: 'ResourcePool',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'CreateTagPayload',
        fields: [
          {
            name: 'tag',
            type: {
              kind: 'OBJECT',
              name: 'Tag',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'DeleteAllocationStrategyPayload',
        fields: [
          {
            name: 'strategy',
            type: {
              kind: 'OBJECT',
              name: 'AllocationStrategy',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'DeleteResourcePoolPayload',
        fields: [
          {
            name: 'resourcePoolId',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'DeleteResourceTypePayload',
        fields: [
          {
            name: 'resourceTypeId',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'DeleteTagPayload',
        fields: [
          {
            name: 'tagId',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'Mutation',
        fields: [
          {
            name: 'CreateTag',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateTagPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'UpdateTag',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'UpdateTagPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'DeleteTag',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'DeleteTagPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'TagPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'TagPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'UntagPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'UntagPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'CreateAllocationStrategy',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateAllocationStrategyPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'DeleteAllocationStrategy',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'DeleteAllocationStrategyPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'TestAllocationStrategy',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [
              {
                name: 'allocationStrategyId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
              {
                name: 'resourcePool',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
              {
                name: 'currentResources',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'LIST',
                    ofType: {
                      kind: 'NON_NULL',
                      ofType: {
                        kind: 'SCALAR',
                        name: 'Any',
                      },
                    },
                  },
                },
              },
              {
                name: 'userInput',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'ClaimResource',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'Resource',
              },
            },
            args: [
              {
                name: 'poolId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
              {
                name: 'description',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'userInput',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'FreeResource',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
              {
                name: 'poolId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'CreateSetPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateSetPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'CreateNestedSetPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateNestedSetPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'CreateSingletonPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateSingletonPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'CreateNestedSingletonPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateNestedSingletonPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'CreateAllocatingPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateAllocatingPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'CreateNestedAllocatingPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateNestedAllocatingPoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'DeleteResourcePool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'DeleteResourcePoolPayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'CreateResourceType',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'CreateResourceTypePayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'DeleteResourceType',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'DeleteResourceTypePayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'UpdateResourceTypeName',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'UpdateResourceTypeNamePayload',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'INTERFACE',
        name: 'Node',
        fields: [
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
        possibleTypes: [
          {
            kind: 'OBJECT',
            name: 'AllocationStrategy',
          },
          {
            kind: 'OBJECT',
            name: 'Tag',
          },
          {
            kind: 'OBJECT',
            name: 'PropertyType',
          },
          {
            kind: 'OBJECT',
            name: 'Resource',
          },
          {
            kind: 'OBJECT',
            name: 'ResourcePool',
          },
          {
            kind: 'OBJECT',
            name: 'ResourceType',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'OutputCursor',
        fields: [
          {
            name: 'ID',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'PoolCapacityPayload',
        fields: [
          {
            name: 'freeCapacity',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'utilizedCapacity',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'ResourceConnection',
        fields: [
          {
            name: 'edges',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'OBJECT',
                  name: 'ResourceEdge',
                },
              },
            },
            args: [],
          },
          {
            name: 'pageInfo',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'PageInfo',
              },
            },
            args: [],
          },
          {
            name: 'totalCount',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'Tag',
        fields: [
          {
            name: 'Pools',
            type: {
              kind: 'LIST',
              ofType: {
                kind: 'OBJECT',
                name: 'ResourcePool',
              },
            },
            args: [],
          },
          {
            name: 'Tag',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'ResourceEdge',
        fields: [
          {
            name: 'cursor',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'OutputCursor',
              },
            },
            args: [],
          },
          {
            name: 'node',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'Resource',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'PropertyType',
        fields: [
          {
            name: 'FloatVal',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'IntVal',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'Mandatory',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'Name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'StringVal',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'Type',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'TagPoolPayload',
        fields: [
          {
            name: 'tag',
            type: {
              kind: 'OBJECT',
              name: 'Tag',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'Resource',
        fields: [
          {
            name: 'Description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'NestedPool',
            type: {
              kind: 'OBJECT',
              name: 'ResourcePool',
            },
            args: [],
          },
          {
            name: 'ParentPool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'ResourcePool',
              },
            },
            args: [],
          },
          {
            name: 'Properties',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'UpdateResourceTypeNamePayload',
        fields: [
          {
            name: 'resourceTypeId',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'PageInfo',
        fields: [
          {
            name: 'endCursor',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'OutputCursor',
              },
            },
            args: [],
          },
          {
            name: 'hasNextPage',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'hasPreviousPage',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'startCursor',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'OutputCursor',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'UntagPoolPayload',
        fields: [
          {
            name: 'tag',
            type: {
              kind: 'OBJECT',
              name: 'Tag',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'ResourcePool',
        fields: [
          {
            name: 'AllocationStrategy',
            type: {
              kind: 'OBJECT',
              name: 'AllocationStrategy',
            },
            args: [],
          },
          {
            name: 'Capacity',
            type: {
              kind: 'OBJECT',
              name: 'PoolCapacityPayload',
            },
            args: [],
          },
          {
            name: 'Name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'ParentResource',
            type: {
              kind: 'OBJECT',
              name: 'Resource',
            },
            args: [],
          },
          {
            name: 'PoolProperties',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'PoolType',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'ResourceType',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'ResourceType',
              },
            },
            args: [],
          },
          {
            name: 'Resources',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'Resource',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'Tags',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'Tag',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'allocatedResources',
            type: {
              kind: 'OBJECT',
              name: 'ResourceConnection',
            },
            args: [
              {
                name: 'first',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'last',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'before',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'after',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'ResourceType',
        fields: [
          {
            name: 'Name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'Pools',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'ResourcePool',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'PropertyTypes',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'PropertyType',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'UpdateTagPayload',
        fields: [
          {
            name: 'tag',
            type: {
              kind: 'OBJECT',
              name: 'Tag',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'Query',
        fields: [
          {
            name: 'QueryPoolCapacity',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'PoolCapacityPayload',
              },
            },
            args: [
              {
                name: 'poolId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'QueryPoolTypes',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'QueryResource',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'Resource',
              },
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
              {
                name: 'poolId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'QueryResources',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'Resource',
                  },
                },
              },
            },
            args: [
              {
                name: 'poolId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'QueryAllocationStrategy',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'AllocationStrategy',
              },
            },
            args: [
              {
                name: 'allocationStrategyId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'QueryAllocationStrategies',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'AllocationStrategy',
                  },
                },
              },
            },
            args: [
              {
                name: 'byName',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'QueryResourceTypes',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'ResourceType',
                  },
                },
              },
            },
            args: [
              {
                name: 'byName',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'QueryResourcePool',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'ResourcePool',
              },
            },
            args: [
              {
                name: 'poolId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'QueryResourcePools',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'ResourcePool',
                  },
                },
              },
            },
            args: [
              {
                name: 'resourceTypeId',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'tags',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'QueryResourcePoolHierarchyPath',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'ResourcePool',
                  },
                },
              },
            },
            args: [
              {
                name: 'poolId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'QueryRootResourcePools',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'ResourcePool',
                  },
                },
              },
            },
            args: [
              {
                name: 'resourceTypeId',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'tags',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'QueryLeafResourcePools',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'ResourcePool',
                  },
                },
              },
            },
            args: [
              {
                name: 'resourceTypeId',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'tags',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'SearchPoolsByTags',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'ResourcePool',
                  },
                },
              },
            },
            args: [
              {
                name: 'tags',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'QueryTags',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: 'Tag',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'node',
            type: {
              kind: 'INTERFACE',
              name: 'Node',
            },
            args: [
              {
                name: 'id',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: '__Schema',
        fields: [
          {
            name: 'description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'types',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: '__Type',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'queryType',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: '__Type',
              },
            },
            args: [],
          },
          {
            name: 'mutationType',
            type: {
              kind: 'OBJECT',
              name: '__Type',
            },
            args: [],
          },
          {
            name: 'subscriptionType',
            type: {
              kind: 'OBJECT',
              name: '__Type',
            },
            args: [],
          },
          {
            name: 'directives',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: '__Directive',
                  },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: '__Type',
        fields: [
          {
            name: 'kind',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'name',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'specifiedByUrl',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'fields',
            type: {
              kind: 'LIST',
              ofType: {
                kind: 'NON_NULL',
                ofType: {
                  kind: 'OBJECT',
                  name: '__Field',
                },
              },
            },
            args: [
              {
                name: 'includeDeprecated',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'interfaces',
            type: {
              kind: 'LIST',
              ofType: {
                kind: 'NON_NULL',
                ofType: {
                  kind: 'OBJECT',
                  name: '__Type',
                },
              },
            },
            args: [],
          },
          {
            name: 'possibleTypes',
            type: {
              kind: 'LIST',
              ofType: {
                kind: 'NON_NULL',
                ofType: {
                  kind: 'OBJECT',
                  name: '__Type',
                },
              },
            },
            args: [],
          },
          {
            name: 'enumValues',
            type: {
              kind: 'LIST',
              ofType: {
                kind: 'NON_NULL',
                ofType: {
                  kind: 'OBJECT',
                  name: '__EnumValue',
                },
              },
            },
            args: [
              {
                name: 'includeDeprecated',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'inputFields',
            type: {
              kind: 'LIST',
              ofType: {
                kind: 'NON_NULL',
                ofType: {
                  kind: 'OBJECT',
                  name: '__InputValue',
                },
              },
            },
            args: [
              {
                name: 'includeDeprecated',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'ofType',
            type: {
              kind: 'OBJECT',
              name: '__Type',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: '__Field',
        fields: [
          {
            name: 'name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'args',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: '__InputValue',
                  },
                },
              },
            },
            args: [
              {
                name: 'includeDeprecated',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
            ],
          },
          {
            name: 'type',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: '__Type',
              },
            },
            args: [],
          },
          {
            name: 'isDeprecated',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'deprecationReason',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: '__InputValue',
        fields: [
          {
            name: 'name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'type',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: '__Type',
              },
            },
            args: [],
          },
          {
            name: 'defaultValue',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'isDeprecated',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'deprecationReason',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: '__EnumValue',
        fields: [
          {
            name: 'name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'isDeprecated',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'deprecationReason',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: '__Directive',
        fields: [
          {
            name: 'name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'description',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'isRepeatable',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'locations',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'args',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'OBJECT',
                    name: '__InputValue',
                  },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'SCALAR',
        name: 'Any',
      },
    ],
    directives: [],
  },
} as unknown) as IntrospectionQuery;
