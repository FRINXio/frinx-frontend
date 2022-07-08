export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  Description: Maybe<Scalars['String']>;
  Lang: AllocationStrategyLang;
  Name: Scalars['String'];
  Script: Scalars['String'];
  id: Scalars['ID'];
};

/** Supported languages for allocation strategy scripts */
export type AllocationStrategyLang =
  | 'js'
  | 'py';

/** Input parameters for creating an allocation pool */
export type CreateAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  poolProperties: Scalars['Map'];
  poolPropertyTypes: Scalars['Map'];
  resourceTypeId: Scalars['ID'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Output of creating an allocating pool */
export type CreateAllocatingPoolPayload = {
  __typename?: 'CreateAllocatingPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a new allocation strategy */
export type CreateAllocationStrategyInput = {
  description?: InputMaybe<Scalars['String']>;
  lang: AllocationStrategyLang;
  name: Scalars['String'];
  script: Scalars['String'];
};

/** Output of creating a new allocation strategy */
export type CreateAllocationStrategyPayload = {
  __typename?: 'CreateAllocationStrategyPayload';
  strategy: Maybe<AllocationStrategy>;
};

/** Input parameters for creating a nested allocation pool */
export type CreateNestedAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  parentResourceId: Scalars['ID'];
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  resourceTypeId: Scalars['ID'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Output of creating a nested allocating pool */
export type CreateNestedAllocatingPoolPayload = {
  __typename?: 'CreateNestedAllocatingPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested set pool */
export type CreateNestedSetPoolInput = {
  description?: InputMaybe<Scalars['String']>;
  parentResourceId: Scalars['ID'];
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  poolValues: Array<InputMaybe<Scalars['Map']>>;
  resourceTypeId: Scalars['ID'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Output of creating a nested set pool */
export type CreateNestedSetPoolPayload = {
  __typename?: 'CreateNestedSetPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested singleton pool */
export type CreateNestedSingletonPoolInput = {
  description?: InputMaybe<Scalars['String']>;
  parentResourceId: Scalars['ID'];
  poolName: Scalars['String'];
  poolValues: Array<InputMaybe<Scalars['Map']>>;
  resourceTypeId: Scalars['ID'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Output of creating a nested singleton pool */
export type CreateNestedSingletonPoolPayload = {
  __typename?: 'CreateNestedSingletonPoolPayload';
  pool: Maybe<ResourcePool>;
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
  description?: InputMaybe<Scalars['String']>;
  poolDealocationSafetyPeriod: Scalars['Int'];
  poolName: Scalars['String'];
  poolValues: Array<Scalars['Map']>;
  resourceTypeId: Scalars['ID'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Output of creating set pool */
export type CreateSetPoolPayload = {
  __typename?: 'CreateSetPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a singleton pool */
export type CreateSingletonPoolInput = {
  description?: InputMaybe<Scalars['String']>;
  poolName: Scalars['String'];
  poolValues: Array<Scalars['Map']>;
  resourceTypeId: Scalars['ID'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Output of creating a singleton pool */
export type CreateSingletonPoolPayload = {
  __typename?: 'CreateSingletonPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a new tag */
export type CreateTagInput = {
  tagText: Scalars['String'];
};

/** Output of creating a tag */
export type CreateTagPayload = {
  __typename?: 'CreateTagPayload';
  tag: Maybe<Tag>;
};

/** Input parameters for deleting an existing allocation strategy */
export type DeleteAllocationStrategyInput = {
  allocationStrategyId: Scalars['ID'];
};

/** Output of deleting an existing allocation strategy */
export type DeleteAllocationStrategyPayload = {
  __typename?: 'DeleteAllocationStrategyPayload';
  strategy: Maybe<AllocationStrategy>;
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
  ClaimResource: Resource;
  ClaimResourceWithAltId: Resource;
  CreateAllocatingPool: CreateAllocatingPoolPayload;
  CreateAllocationStrategy: CreateAllocationStrategyPayload;
  CreateNestedAllocatingPool: CreateNestedAllocatingPoolPayload;
  CreateNestedSetPool: CreateNestedSetPoolPayload;
  CreateNestedSingletonPool: CreateNestedSingletonPoolPayload;
  CreateResourceType: CreateResourceTypePayload;
  CreateSetPool: CreateSetPoolPayload;
  CreateSingletonPool: CreateSingletonPoolPayload;
  CreateTag: CreateTagPayload;
  DeleteAllocationStrategy: DeleteAllocationStrategyPayload;
  DeleteResourcePool: DeleteResourcePoolPayload;
  DeleteResourceType: DeleteResourceTypePayload;
  DeleteTag: DeleteTagPayload;
  FreeResource: Scalars['String'];
  TagPool: TagPoolPayload;
  TestAllocationStrategy: Scalars['Map'];
  UntagPool: UntagPoolPayload;
  UpdateResourceAltId: Resource;
  UpdateResourceTypeName: UpdateResourceTypeNamePayload;
  UpdateTag: UpdateTagPayload;
};


export type MutationClaimResourceArgs = {
  description?: InputMaybe<Scalars['String']>;
  poolId: Scalars['ID'];
  userInput: Scalars['Map'];
};


export type MutationClaimResourceWithAltIdArgs = {
  alternativeId: Scalars['Map'];
  description?: InputMaybe<Scalars['String']>;
  poolId: Scalars['ID'];
  userInput: Scalars['Map'];
};


export type MutationCreateAllocatingPoolArgs = {
  input?: InputMaybe<CreateAllocatingPoolInput>;
};


export type MutationCreateAllocationStrategyArgs = {
  input?: InputMaybe<CreateAllocationStrategyInput>;
};


export type MutationCreateNestedAllocatingPoolArgs = {
  input: CreateNestedAllocatingPoolInput;
};


export type MutationCreateNestedSetPoolArgs = {
  input: CreateNestedSetPoolInput;
};


export type MutationCreateNestedSingletonPoolArgs = {
  input: CreateNestedSingletonPoolInput;
};


export type MutationCreateResourceTypeArgs = {
  input: CreateResourceTypeInput;
};


export type MutationCreateSetPoolArgs = {
  input: CreateSetPoolInput;
};


export type MutationCreateSingletonPoolArgs = {
  input?: InputMaybe<CreateSingletonPoolInput>;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationDeleteAllocationStrategyArgs = {
  input?: InputMaybe<DeleteAllocationStrategyInput>;
};


export type MutationDeleteResourcePoolArgs = {
  input: DeleteResourcePoolInput;
};


export type MutationDeleteResourceTypeArgs = {
  input: DeleteResourceTypeInput;
};


export type MutationDeleteTagArgs = {
  input: DeleteTagInput;
};


export type MutationFreeResourceArgs = {
  input: Scalars['Map'];
  poolId: Scalars['ID'];
};


export type MutationTagPoolArgs = {
  input: TagPoolInput;
};


export type MutationTestAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID'];
  currentResources: Array<ResourceInput>;
  resourcePool: ResourcePoolInput;
  userInput: Scalars['Map'];
};


export type MutationUntagPoolArgs = {
  input: UntagPoolInput;
};


export type MutationUpdateResourceAltIdArgs = {
  alternativeId: Scalars['Map'];
  input: Scalars['Map'];
  poolId: Scalars['ID'];
};


export type MutationUpdateResourceTypeNameArgs = {
  input: UpdateResourceTypeNameInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
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

/** Holds information about the requested pagination page */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: OutputCursor;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: OutputCursor;
};

/** Entity representing capacity of a pool */
export type PoolCapacityPayload = {
  __typename?: 'PoolCapacityPayload';
  freeCapacity: Scalars['String'];
  utilizedCapacity: Scalars['String'];
};

/** Defines the type of pool */
export type PoolType =
  | 'allocating'
  | 'set'
  | 'singleton';

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

export type Query = {
  __typename?: 'Query';
  QueryAllocationStrategies: Array<AllocationStrategy>;
  QueryAllocationStrategy: AllocationStrategy;
  QueryEmptyResourcePools: Array<ResourcePool>;
  QueryLeafResourcePools: Array<ResourcePool>;
  QueryPoolCapacity: PoolCapacityPayload;
  QueryPoolTypes: Array<PoolType>;
  QueryRecentlyActiveResources: ResourceConnection;
  QueryResource: Resource;
  QueryResourcePool: ResourcePool;
  QueryResourcePoolHierarchyPath: Array<ResourcePool>;
  QueryResourcePools: Array<ResourcePool>;
  QueryResourceTypes: Array<ResourceType>;
  QueryResources: ResourceConnection;
  QueryResourcesByAltId: ResourceConnection;
  QueryRootResourcePools: Array<ResourcePool>;
  QueryTags: Array<Tag>;
  SearchPoolsByTags: Array<ResourcePool>;
  node: Maybe<Node>;
};


export type QueryQueryAllocationStrategiesArgs = {
  byName?: InputMaybe<Scalars['String']>;
};


export type QueryQueryAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID'];
};


export type QueryQueryEmptyResourcePoolsArgs = {
  resourceTypeId?: InputMaybe<Scalars['ID']>;
};


export type QueryQueryLeafResourcePoolsArgs = {
  resourceTypeId?: InputMaybe<Scalars['ID']>;
  tags?: InputMaybe<TagOr>;
};


export type QueryQueryPoolCapacityArgs = {
  poolId: Scalars['ID'];
};


export type QueryQueryRecentlyActiveResourcesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  fromDatetime: Scalars['String'];
  last?: InputMaybe<Scalars['Int']>;
  toDatetime?: InputMaybe<Scalars['String']>;
};


export type QueryQueryResourceArgs = {
  input: Scalars['Map'];
  poolId: Scalars['ID'];
};


export type QueryQueryResourcePoolArgs = {
  poolId: Scalars['ID'];
};


export type QueryQueryResourcePoolHierarchyPathArgs = {
  poolId: Scalars['ID'];
};


export type QueryQueryResourcePoolsArgs = {
  resourceTypeId?: InputMaybe<Scalars['ID']>;
  tags?: InputMaybe<TagOr>;
};


export type QueryQueryResourceTypesArgs = {
  byName?: InputMaybe<Scalars['String']>;
};


export type QueryQueryResourcesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  poolId: Scalars['ID'];
};


export type QueryQueryResourcesByAltIdArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  input: Scalars['Map'];
  last?: InputMaybe<Scalars['Int']>;
  poolId?: InputMaybe<Scalars['ID']>;
};


export type QueryQueryRootResourcePoolsArgs = {
  resourceTypeId?: InputMaybe<Scalars['ID']>;
  tags?: InputMaybe<TagOr>;
};


export type QuerySearchPoolsByTagsArgs = {
  tags?: InputMaybe<TagOr>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

/** Represents an allocated resource */
export type Resource = Node & {
  __typename?: 'Resource';
  AlternativeId: Scalars['Map'];
  Description: Maybe<Scalars['String']>;
  NestedPool: Maybe<ResourcePool>;
  ParentPool: ResourcePool;
  Properties: Scalars['Map'];
  id: Scalars['ID'];
};

/** A Relay-specific entity holding information about pagination */
export type ResourceConnection = {
  __typename?: 'ResourceConnection';
  edges: Array<Maybe<ResourceEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay-specific entity that holds information about the requested pagination page */
export type ResourceEdge = {
  __typename?: 'ResourceEdge';
  cursor: OutputCursor;
  node: Resource;
};

/** Alternative representation of identity of a resource (i.e. alternative to resource ID) */
export type ResourceInput = {
  Properties: Scalars['Map'];
  Status: Scalars['String'];
  UpdatedAt: Scalars['String'];
};

/** A pool is an entity that contains allocated and free resources */
export type ResourcePool = Node & {
  __typename?: 'ResourcePool';
  AllocationStrategy: Maybe<AllocationStrategy>;
  Capacity: Maybe<PoolCapacityPayload>;
  Name: Scalars['String'];
  ParentResource: Maybe<Resource>;
  PoolProperties: Scalars['Map'];
  PoolType: PoolType;
  ResourceType: ResourceType;
  Resources: Array<Resource>;
  Tags: Array<Tag>;
  allocatedResources: Maybe<ResourceConnection>;
  id: Scalars['ID'];
};


/** A pool is an entity that contains allocated and free resources */
export type ResourcePoolAllocatedResourcesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** Convenience entity representing the identity of a pool in some calls */
export type ResourcePoolInput = {
  ResourcePoolID: Scalars['ID'];
  ResourcePoolName: Scalars['String'];
  poolProperties: Scalars['Map'];
};

/** Describes the properties of a resource */
export type ResourceType = Node & {
  __typename?: 'ResourceType';
  Name: Scalars['String'];
  Pools: Array<ResourcePool>;
  PropertyTypes: Array<PropertyType>;
  id: Scalars['ID'];
};

/** Pools can be tagged for easier search */
export type Tag = Node & {
  __typename?: 'Tag';
  Pools: Maybe<Array<Maybe<ResourcePool>>>;
  Tag: Scalars['String'];
  id: Scalars['ID'];
};

/** Helper entities for tag search */
export type TagAnd = {
  matchesAll: Array<Scalars['String']>;
};

/** Helper entities for tag search */
export type TagOr = {
  matchesAny: Array<TagAnd>;
};

/** Input parameters for a call adding a tag to pool */
export type TagPoolInput = {
  poolId: Scalars['ID'];
  tagId: Scalars['ID'];
};

/** Output of adding a specific tag to a pool */
export type TagPoolPayload = {
  __typename?: 'TagPoolPayload';
  tag: Maybe<Tag>;
};

/** Input parameters for a call removing a tag from pool */
export type UntagPoolInput = {
  poolId: Scalars['ID'];
  tagId: Scalars['ID'];
};

/** Output of removing a specific tag from a pool */
export type UntagPoolPayload = {
  __typename?: 'UntagPoolPayload';
  tag: Maybe<Tag>;
};

/** Input parameters updating the name of a resource-type */
export type UpdateResourceTypeNameInput = {
  resourceName: Scalars['String'];
  resourceTypeId: Scalars['ID'];
};

/** Output of updating the name of a resource-type */
export type UpdateResourceTypeNamePayload = {
  __typename?: 'UpdateResourceTypeNamePayload';
  resourceTypeId: Scalars['ID'];
};

/** Input parameters for updating an existing tag */
export type UpdateTagInput = {
  tagId: Scalars['ID'];
  tagText: Scalars['String'];
};

/** Output of updating a tag */
export type UpdateTagPayload = {
  __typename?: 'UpdateTagPayload';
  tag: Maybe<Tag>;
};

export type ClaimResourceMutationMutationVariables = Exact<{
  poolId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  userInput: Scalars['Map'];
}>;


export type ClaimResourceMutationMutation = { __typename?: 'Mutation', ClaimResource: { __typename?: 'Resource', id: string } };

export type CreateNestedPoolMutationMutationVariables = Exact<{
  input: CreateNestedSetPoolInput;
}>;


export type CreateNestedPoolMutationMutation = { __typename?: 'Mutation', CreateNestedSetPool: { __typename?: 'CreateNestedSetPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type AddStrategyMutationMutationVariables = Exact<{
  input: CreateAllocationStrategyInput;
}>;


export type AddStrategyMutationMutation = { __typename?: 'Mutation', CreateAllocationStrategy: { __typename?: 'CreateAllocationStrategyPayload', strategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string } | null } };

export type DeletePoolMutationMutationVariables = Exact<{
  input: DeleteResourcePoolInput;
}>;


export type DeletePoolMutationMutation = { __typename?: 'Mutation', DeleteResourcePool: { __typename?: 'DeleteResourcePoolPayload', resourcePoolId: string } };

export type DeleteStrategyMutationMutationVariables = Exact<{
  input: DeleteAllocationStrategyInput;
}>;


export type DeleteStrategyMutationMutation = { __typename?: 'Mutation', DeleteAllocationStrategy: { __typename?: 'DeleteAllocationStrategyPayload', strategy: { __typename?: 'AllocationStrategy', id: string } | null } };

export type FreeResourceMutationMutationVariables = Exact<{
  poolId: Scalars['ID'];
  input: Scalars['Map'];
}>;


export type FreeResourceMutationMutation = { __typename?: 'Mutation', FreeResource: string };

export type QueryAllPoolsNestedQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllPoolsNestedQuery = { __typename?: 'Query', QueryRootResourcePools: Array<{ __typename?: 'ResourcePool', id: string, Name: string, Resources: Array<{ __typename?: 'Resource', id: string, Properties: any, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, Resources: Array<{ __typename?: 'Resource', id: string, Properties: any }> } | null }> }> };

export type QueryAllocationStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllocationStrategiesQuery = { __typename?: 'Query', QueryAllocationStrategies: Array<{ __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string }> };

export type GetNestedPoolsDetailQueryVariables = Exact<{
  poolId: Scalars['ID'];
}>;


export type GetNestedPoolsDetailQuery = { __typename?: 'Query', QueryResourcePool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } };

export type DeletePoolMutationVariables = Exact<{
  input: DeleteResourcePoolInput;
}>;


export type DeletePoolMutation = { __typename?: 'Mutation', DeleteResourcePool: { __typename?: 'DeleteResourcePoolPayload', resourcePoolId: string } };

export type CreateSetPoolMutationVariables = Exact<{
  input: CreateSetPoolInput;
}>;


export type CreateSetPoolMutation = { __typename?: 'Mutation', CreateSetPool: { __typename?: 'CreateSetPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type CreateNestedSetPoolMutationVariables = Exact<{
  input: CreateNestedSetPoolInput;
}>;


export type CreateNestedSetPoolMutation = { __typename?: 'Mutation', CreateNestedSetPool: { __typename?: 'CreateNestedSetPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type CreateSingletonPoolMutationVariables = Exact<{
  input: CreateSingletonPoolInput;
}>;


export type CreateSingletonPoolMutation = { __typename?: 'Mutation', CreateSingletonPool: { __typename?: 'CreateSingletonPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type CreateNestedSingletonPoolMutationVariables = Exact<{
  input: CreateNestedSingletonPoolInput;
}>;


export type CreateNestedSingletonPoolMutation = { __typename?: 'Mutation', CreateNestedSingletonPool: { __typename?: 'CreateNestedSingletonPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type CreateAllocationPoolMutationVariables = Exact<{
  input: CreateAllocatingPoolInput;
}>;


export type CreateAllocationPoolMutation = { __typename?: 'Mutation', CreateAllocatingPool: { __typename?: 'CreateAllocatingPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type CreateNestedAllocationPoolMutationVariables = Exact<{
  input: CreateNestedAllocatingPoolInput;
}>;


export type CreateNestedAllocationPoolMutation = { __typename?: 'Mutation', CreateNestedAllocatingPool: { __typename?: 'CreateNestedAllocatingPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type SelectResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type SelectResourceTypesQuery = { __typename?: 'Query', QueryResourceTypes: Array<{ __typename?: 'ResourceType', Name: string, id: string }> };

export type SelectPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type SelectPoolsQuery = { __typename?: 'Query', QueryResourcePools: Array<{ __typename?: 'ResourcePool', id: string, Name: string, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', Description: string | null, Properties: any, id: string, ParentPool: { __typename?: 'ResourcePool', id: string, Name: string }, NestedPool: { __typename?: 'ResourcePool', id: string, PoolProperties: any } | null }> }> };

export type SelectAllocationStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type SelectAllocationStrategiesQuery = { __typename?: 'Query', QueryAllocationStrategies: Array<{ __typename?: 'AllocationStrategy', id: string, Name: string }> };

export type GetAllIpPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllIpPoolsQuery = { __typename?: 'Query', QueryRootResourcePools: Array<{ __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null }> };

export type GetPoolDetailQueryVariables = Exact<{
  poolId: Scalars['ID'];
}>;


export type GetPoolDetailQuery = { __typename?: 'Query', QueryResourcePool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Resources: Array<{ __typename?: 'Resource', Description: string | null, Properties: any, id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, ParentResource: { __typename?: 'Resource', ParentPool: { __typename?: 'ResourcePool', id: string, Name: string } } | null, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } | null }>, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string } } };

export type AllocatedResourcesQueryVariables = Exact<{
  poolId: Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type AllocatedResourcesQuery = { __typename?: 'Query', QueryResources: { __typename?: 'ResourceConnection', totalCount: number, edges: Array<{ __typename?: 'ResourceEdge', node: { __typename?: 'Resource', id: string, Properties: any, Description: string | null } } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: { __typename?: 'OutputCursor', ID: string }, endCursor: { __typename?: 'OutputCursor', ID: string } } } };

export type GetResourceTypeByNameQueryVariables = Exact<{ [key: string]: never; }>;


export type GetResourceTypeByNameQuery = { __typename?: 'Query', QueryResourceTypes: Array<{ __typename?: 'ResourceType', id: string, Name: string }> };

export type ClaimAddressMutationVariables = Exact<{
  input: CreateNestedSetPoolInput;
}>;


export type ClaimAddressMutation = { __typename?: 'Mutation', CreateNestedSetPool: { __typename?: 'CreateNestedSetPoolPayload', pool: { __typename?: 'ResourcePool', id: string } | null } };

export type ClaimResourceMutationVariables = Exact<{
  poolId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  userInput: Scalars['Map'];
}>;


export type ClaimResourceMutation = { __typename?: 'Mutation', ClaimResource: { __typename?: 'Resource', id: string, Properties: any } };

export type FreeResourceMutationVariables = Exact<{
  poolId: Scalars['ID'];
  input: Scalars['Map'];
}>;


export type FreeResourceMutation = { __typename?: 'Mutation', FreeResource: string };

export type GetPoolsQueryVariables = Exact<{
  tags?: InputMaybe<TagOr>;
}>;


export type GetPoolsQuery = { __typename?: 'Query', QueryRootResourcePools: Array<{ __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null }> };

export type ResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type ResourceTypesQuery = { __typename?: 'Query', QueryResourceTypes: Array<{ __typename?: 'ResourceType', id: string, Name: string }> };

export type CreateResourceTypeMutationVariables = Exact<{
  input: CreateResourceTypeInput;
}>;


export type CreateResourceTypeMutation = { __typename?: 'Mutation', CreateResourceType: { __typename?: 'CreateResourceTypePayload', resourceType: { __typename?: 'ResourceType', Name: string } } };

export type DeleteResourceTypeMutationVariables = Exact<{
  input: DeleteResourceTypeInput;
}>;


export type DeleteResourceTypeMutation = { __typename?: 'Mutation', DeleteResourceType: { __typename?: 'DeleteResourceTypePayload', resourceTypeId: string } };

export type DeleteStrategyMutationVariables = Exact<{
  input: DeleteAllocationStrategyInput;
}>;


export type DeleteStrategyMutation = { __typename?: 'Mutation', DeleteAllocationStrategy: { __typename?: 'DeleteAllocationStrategyPayload', strategy: { __typename?: 'AllocationStrategy', id: string } | null } };
