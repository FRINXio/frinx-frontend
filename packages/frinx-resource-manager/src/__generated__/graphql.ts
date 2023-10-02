export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: any; output: any; }
  Map: { input: any; output: any; }
};

/** Represents an allocation strategy */
export type AllocationStrategy = Node & {
  __typename?: 'AllocationStrategy';
  Description: Maybe<Scalars['String']['output']>;
  Lang: AllocationStrategyLang;
  Name: Scalars['String']['output'];
  Script: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

/** Supported languages for allocation strategy scripts */
export type AllocationStrategyLang =
  | 'js'
  | 'py';

/** Input parameters for creating an allocation pool */
export type CreateAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  poolProperties: Scalars['Map']['input'];
  poolPropertyTypes: Scalars['Map']['input'];
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating an allocating pool */
export type CreateAllocatingPoolPayload = {
  __typename?: 'CreateAllocatingPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a new allocation strategy */
export type CreateAllocationStrategyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expectedPoolPropertyTypes?: InputMaybe<Scalars['Map']['input']>;
  lang: AllocationStrategyLang;
  name: Scalars['String']['input'];
  script: Scalars['String']['input'];
};

/** Output of creating a new allocation strategy */
export type CreateAllocationStrategyPayload = {
  __typename?: 'CreateAllocationStrategyPayload';
  strategy: Maybe<AllocationStrategy>;
};

/** Input parameters for creating a nested allocation pool */
export type CreateNestedAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  parentResourceId: Scalars['ID']['input'];
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a nested allocating pool */
export type CreateNestedAllocatingPoolPayload = {
  __typename?: 'CreateNestedAllocatingPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested set pool */
export type CreateNestedSetPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  parentResourceId: Scalars['ID']['input'];
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  poolValues: Array<InputMaybe<Scalars['Map']['input']>>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a nested set pool */
export type CreateNestedSetPoolPayload = {
  __typename?: 'CreateNestedSetPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested singleton pool */
export type CreateNestedSingletonPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  parentResourceId: Scalars['ID']['input'];
  poolName: Scalars['String']['input'];
  poolValues: Array<InputMaybe<Scalars['Map']['input']>>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a nested singleton pool */
export type CreateNestedSingletonPoolPayload = {
  __typename?: 'CreateNestedSingletonPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Creating a new resource-type */
export type CreateResourceTypeInput = {
  /** name of the resource type AND property type (should they be different?) */
  resourceName: Scalars['String']['input'];
  /**
   * resourceProperties: Map! - for key "init" the value is the initial value of the property type (like 7)
   *                          - for key "type" the value is the name of the type like "int"
   */
  resourceProperties: Scalars['Map']['input'];
};

/** Output of creating a new resource-type */
export type CreateResourceTypePayload = {
  __typename?: 'CreateResourceTypePayload';
  resourceType: ResourceType;
};

/** Input parameters for creating a set pool */
export type CreateSetPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  poolValues: Array<Scalars['Map']['input']>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating set pool */
export type CreateSetPoolPayload = {
  __typename?: 'CreateSetPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a singleton pool */
export type CreateSingletonPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  poolName: Scalars['String']['input'];
  poolValues: Array<Scalars['Map']['input']>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a singleton pool */
export type CreateSingletonPoolPayload = {
  __typename?: 'CreateSingletonPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a new tag */
export type CreateTagInput = {
  tagText: Scalars['String']['input'];
};

/** Output of creating a tag */
export type CreateTagPayload = {
  __typename?: 'CreateTagPayload';
  tag: Maybe<Tag>;
};

/** Input parameters for deleting an existing allocation strategy */
export type DeleteAllocationStrategyInput = {
  allocationStrategyId: Scalars['ID']['input'];
};

/** Output of deleting an existing allocation strategy */
export type DeleteAllocationStrategyPayload = {
  __typename?: 'DeleteAllocationStrategyPayload';
  strategy: Maybe<AllocationStrategy>;
};

/** Input entity for deleting a pool */
export type DeleteResourcePoolInput = {
  resourcePoolId: Scalars['ID']['input'];
};

/** Output entity for deleting a pool */
export type DeleteResourcePoolPayload = {
  __typename?: 'DeleteResourcePoolPayload';
  resourcePoolId: Scalars['ID']['output'];
};

/** Input parameters for deleting an existing resource-type */
export type DeleteResourceTypeInput = {
  resourceTypeId: Scalars['ID']['input'];
};

/** Output of deleting a resource-type */
export type DeleteResourceTypePayload = {
  __typename?: 'DeleteResourceTypePayload';
  resourceTypeId: Scalars['ID']['output'];
};

/** Input parameters for deleting an existing tag */
export type DeleteTagInput = {
  tagId: Scalars['ID']['input'];
};

/** Output of deleting a tag */
export type DeleteTagPayload = {
  __typename?: 'DeleteTagPayload';
  tagId: Scalars['ID']['output'];
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
  FreeResource: Scalars['String']['output'];
  TagPool: TagPoolPayload;
  TestAllocationStrategy: Scalars['Map']['output'];
  UntagPool: UntagPoolPayload;
  UpdateResourceAltId: Resource;
  UpdateResourceTypeName: UpdateResourceTypeNamePayload;
  UpdateTag: UpdateTagPayload;
};


export type MutationClaimResourceArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  poolId: Scalars['ID']['input'];
  userInput: Scalars['Map']['input'];
};


export type MutationClaimResourceWithAltIdArgs = {
  alternativeId: Scalars['Map']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  poolId: Scalars['ID']['input'];
  userInput: Scalars['Map']['input'];
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
  input: Scalars['Map']['input'];
  poolId: Scalars['ID']['input'];
};


export type MutationTagPoolArgs = {
  input: TagPoolInput;
};


export type MutationTestAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID']['input'];
  currentResources: Array<ResourceInput>;
  resourcePool: ResourcePoolInput;
  userInput: Scalars['Map']['input'];
};


export type MutationUntagPoolArgs = {
  input: UntagPoolInput;
};


export type MutationUpdateResourceAltIdArgs = {
  alternativeId: Scalars['Map']['input'];
  input: Scalars['Map']['input'];
  poolId: Scalars['ID']['input'];
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
  id: Scalars['ID']['output'];
};

export type OrderDirection =
  | 'ASC'
  | 'DESC';

/** Holds the string value for pagination */
export type OutputCursor = {
  __typename?: 'OutputCursor';
  ID: Scalars['String']['output'];
};

/** Holds information about the requested pagination page */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Maybe<OutputCursor>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Maybe<OutputCursor>;
};

/** Entity representing capacity of a pool */
export type PoolCapacityPayload = {
  __typename?: 'PoolCapacityPayload';
  freeCapacity: Scalars['String']['output'];
  utilizedCapacity: Scalars['String']['output'];
};

/** Defines the type of pool */
export type PoolType =
  | 'allocating'
  | 'set'
  | 'singleton';

/** Defines the type of the property */
export type PropertyType = Node & {
  __typename?: 'PropertyType';
  FloatVal: Maybe<Scalars['Float']['output']>;
  IntVal: Maybe<Scalars['Int']['output']>;
  Mandatory: Maybe<Scalars['Boolean']['output']>;
  Name: Scalars['String']['output'];
  StringVal: Maybe<Scalars['String']['output']>;
  Type: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  QueryAllocationStrategies: Array<AllocationStrategy>;
  QueryAllocationStrategy: AllocationStrategy;
  QueryEmptyResourcePools: ResourcePoolConnection;
  QueryLeafResourcePools: ResourcePoolConnection;
  QueryPoolCapacity: PoolCapacityPayload;
  QueryPoolTypes: Array<PoolType>;
  QueryRecentlyActiveResources: ResourceConnection;
  QueryRequiredPoolProperties: Array<PropertyType>;
  QueryResource: Resource;
  QueryResourcePool: ResourcePool;
  QueryResourcePoolHierarchyPath: Array<ResourcePool>;
  QueryResourcePools: ResourcePoolConnection;
  QueryResourceTypes: Array<ResourceType>;
  QueryResources: ResourceConnection;
  QueryResourcesByAltId: ResourceConnection;
  QueryRootResourcePools: ResourcePoolConnection;
  QueryTags: Array<Tag>;
  SearchPoolsByTags: ResourcePoolConnection;
  node: Maybe<Node>;
};


export type QueryQueryAllocationStrategiesArgs = {
  byName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQueryAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID']['input'];
};


export type QueryQueryEmptyResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
};


export type QueryQueryLeafResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
  tags?: InputMaybe<TagOr>;
};


export type QueryQueryPoolCapacityArgs = {
  poolId: Scalars['ID']['input'];
};


export type QueryQueryRecentlyActiveResourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromDatetime: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
  toDatetime?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQueryRequiredPoolPropertiesArgs = {
  allocationStrategyName: Scalars['String']['input'];
};


export type QueryQueryResourceArgs = {
  input: Scalars['Map']['input'];
  poolId: Scalars['ID']['input'];
};


export type QueryQueryResourcePoolArgs = {
  poolId: Scalars['ID']['input'];
};


export type QueryQueryResourcePoolHierarchyPathArgs = {
  poolId: Scalars['ID']['input'];
};


export type QueryQueryResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
  tags?: InputMaybe<TagOr>;
};


export type QueryQueryResourceTypesArgs = {
  byName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQueryResourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  poolId: Scalars['ID']['input'];
};


export type QueryQueryResourcesByAltIdArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input: Scalars['Map']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
  poolId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryQueryRootResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
  tags?: InputMaybe<TagOr>;
};


export type QuerySearchPoolsByTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<TagOr>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

/** Represents an allocated resource */
export type Resource = Node & {
  __typename?: 'Resource';
  AlternativeId: Maybe<Scalars['Map']['output']>;
  Description: Maybe<Scalars['String']['output']>;
  NestedPool: Maybe<ResourcePool>;
  ParentPool: ResourcePool;
  Properties: Scalars['Map']['output'];
  id: Scalars['ID']['output'];
};

/** A Relay-specific entity holding information about pagination */
export type ResourceConnection = {
  __typename?: 'ResourceConnection';
  edges: Array<Maybe<ResourceEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** A Relay-specific entity that holds information about the requested pagination page */
export type ResourceEdge = {
  __typename?: 'ResourceEdge';
  cursor: OutputCursor;
  node: Resource;
};

/** Alternative representation of identity of a resource (i.e. alternative to resource ID) */
export type ResourceInput = {
  Properties: Scalars['Map']['input'];
  Status: Scalars['String']['input'];
  UpdatedAt: Scalars['String']['input'];
};

/** A pool is an entity that contains allocated and free resources */
export type ResourcePool = Node & {
  __typename?: 'ResourcePool';
  AllocationStrategy: Maybe<AllocationStrategy>;
  Capacity: Maybe<PoolCapacityPayload>;
  DealocationSafetyPeriod: Scalars['Int']['output'];
  Name: Scalars['String']['output'];
  ParentResource: Maybe<Resource>;
  PoolProperties: Scalars['Map']['output'];
  PoolType: PoolType;
  ResourceType: ResourceType;
  Resources: Array<Resource>;
  Tags: Array<Tag>;
  allocatedResources: Maybe<ResourceConnection>;
  id: Scalars['ID']['output'];
};


/** A pool is an entity that contains allocated and free resources */
export type ResourcePoolAllocatedResourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ResourcePoolConnection = {
  __typename?: 'ResourcePoolConnection';
  edges: Array<Maybe<ResourcePoolEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ResourcePoolEdge = {
  __typename?: 'ResourcePoolEdge';
  cursor: OutputCursor;
  node: ResourcePool;
};

/** Convenience entity representing the identity of a pool in some calls */
export type ResourcePoolInput = {
  ResourcePoolID: Scalars['ID']['input'];
  ResourcePoolName: Scalars['String']['input'];
  poolProperties: Scalars['Map']['input'];
};

export type ResourcePoolOrderField =
  | 'dealocationSafetyPeriod'
  | 'name';

/** Describes the properties of a resource */
export type ResourceType = Node & {
  __typename?: 'ResourceType';
  Name: Scalars['String']['output'];
  Pools: Array<ResourcePool>;
  PropertyTypes: Array<PropertyType>;
  id: Scalars['ID']['output'];
};

export type SortResourcePoolsInput = {
  direction: OrderDirection;
  field?: InputMaybe<ResourcePoolOrderField>;
};

/** Pools can be tagged for easier search */
export type Tag = Node & {
  __typename?: 'Tag';
  Pools: Maybe<Array<Maybe<ResourcePool>>>;
  Tag: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

/** Helper entities for tag search */
export type TagAnd = {
  matchesAll: Array<Scalars['String']['input']>;
};

/** Helper entities for tag search */
export type TagOr = {
  matchesAny: Array<TagAnd>;
};

/** Input parameters for a call adding a tag to pool */
export type TagPoolInput = {
  poolId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};

/** Output of adding a specific tag to a pool */
export type TagPoolPayload = {
  __typename?: 'TagPoolPayload';
  tag: Maybe<Tag>;
};

/** Input parameters for a call removing a tag from pool */
export type UntagPoolInput = {
  poolId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};

/** Output of removing a specific tag from a pool */
export type UntagPoolPayload = {
  __typename?: 'UntagPoolPayload';
  tag: Maybe<Tag>;
};

/** Input parameters updating the name of a resource-type */
export type UpdateResourceTypeNameInput = {
  resourceName: Scalars['String']['input'];
  resourceTypeId: Scalars['ID']['input'];
};

/** Output of updating the name of a resource-type */
export type UpdateResourceTypeNamePayload = {
  __typename?: 'UpdateResourceTypeNamePayload';
  resourceTypeId: Scalars['ID']['output'];
};

/** Input parameters for updating an existing tag */
export type UpdateTagInput = {
  tagId: Scalars['ID']['input'];
  tagText: Scalars['String']['input'];
};

/** Output of updating a tag */
export type UpdateTagPayload = {
  __typename?: 'UpdateTagPayload';
  tag: Maybe<Tag>;
};

export type ClaimResourceMutationMutationVariables = Exact<{
  poolId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  userInput: Scalars['Map']['input'];
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
  poolId: Scalars['ID']['input'];
  input: Scalars['Map']['input'];
}>;


export type FreeResourceMutationMutation = { __typename?: 'Mutation', FreeResource: string };

export type AllPoolsNestedQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPoolsNestedQuery = { __typename?: 'Query', QueryRootResourcePools: { __typename?: 'ResourcePoolConnection', edges: Array<{ __typename?: 'ResourcePoolEdge', node: { __typename?: 'ResourcePool', id: string, Name: string, Resources: Array<{ __typename?: 'Resource', id: string, Properties: any, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, Resources: Array<{ __typename?: 'Resource', id: string, Properties: any }> } | null }> } } | null> } };

export type QueryAllocationStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllocationStrategiesQuery = { __typename?: 'Query', QueryAllocationStrategies: Array<{ __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string }> };

export type GetPoolDetailQueryVariables = Exact<{
  poolId: Scalars['ID']['input'];
}>;


export type GetPoolDetailQuery = { __typename?: 'Query', QueryResourcePool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Resources: Array<{ __typename?: 'Resource', Description: string | null, Properties: any, id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, ParentResource: { __typename?: 'Resource', ParentPool: { __typename?: 'ResourcePool', id: string, Name: string } } | null, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string, ResourceType: { __typename?: 'ResourceType', id: string, Name: string } } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } | null }>, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string } } };

export type AllocatedResourcesQueryVariables = Exact<{
  input: Scalars['Map']['input'];
  poolId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type AllocatedResourcesQuery = { __typename?: 'Query', QueryResourcesByAltId: { __typename?: 'ResourceConnection', totalCount: number, edges: Array<{ __typename?: 'ResourceEdge', node: { __typename?: 'Resource', id: string, Properties: any, Description: string | null, AlternativeId: any | null, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null } } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: { __typename?: 'OutputCursor', ID: string } | null, endCursor: { __typename?: 'OutputCursor', ID: string } | null } } };

export type GetResourceTypeByNameQueryVariables = Exact<{ [key: string]: never; }>;


export type GetResourceTypeByNameQuery = { __typename?: 'Query', QueryResourceTypes: Array<{ __typename?: 'ResourceType', id: string, Name: string }> };

export type ClaimResourceMutationVariables = Exact<{
  poolId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  userInput: Scalars['Map']['input'];
}>;


export type ClaimResourceMutation = { __typename?: 'Mutation', ClaimResource: { __typename?: 'Resource', id: string, Properties: any } };

export type ClaimResourceWithAltIdMutationVariables = Exact<{
  poolId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  userInput: Scalars['Map']['input'];
  alternativeId: Scalars['Map']['input'];
}>;


export type ClaimResourceWithAltIdMutation = { __typename?: 'Mutation', ClaimResourceWithAltId: { __typename?: 'Resource', id: string, Properties: any } };

export type FreeResourceMutationVariables = Exact<{
  poolId: Scalars['ID']['input'];
  input: Scalars['Map']['input'];
}>;


export type FreeResourceMutation = { __typename?: 'Mutation', FreeResource: string };

export type DeletePoolMutationVariables = Exact<{
  input: DeleteResourcePoolInput;
}>;


export type DeletePoolMutation = { __typename?: 'Mutation', DeleteResourcePool: { __typename?: 'DeleteResourcePoolPayload', resourcePoolId: string } };

export type GetNestedPoolsDetailQueryVariables = Exact<{
  poolId: Scalars['ID']['input'];
}>;


export type GetNestedPoolsDetailQuery = { __typename?: 'Query', QueryResourcePool: { __typename?: 'ResourcePool', id: string, Name: string, DealocationSafetyPeriod: number, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } };

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


export type SelectResourceTypesQuery = { __typename?: 'Query', QueryResourceTypes: Array<{ __typename?: 'ResourceType', Name: string, id: string, Pools: Array<{ __typename?: 'ResourcePool', id: string, Name: string }>, PropertyTypes: Array<{ __typename?: 'PropertyType', id: string, Name: string }> }> };

export type SelectPoolsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
}>;


export type SelectPoolsQuery = { __typename?: 'Query', QueryRootResourcePools: { __typename?: 'ResourcePoolConnection', edges: Array<{ __typename?: 'ResourcePoolEdge', node: { __typename?: 'ResourcePool', id: string, Name: string, PoolProperties: any, ParentResource: { __typename?: 'Resource', id: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string, Pools: Array<{ __typename?: 'ResourcePool', id: string, Name: string }>, PropertyTypes: Array<{ __typename?: 'PropertyType', id: string, Name: string }> }, Resources: Array<{ __typename?: 'Resource', Description: string | null, Properties: any, id: string, NestedPool: { __typename?: 'ResourcePool', id: string } | null, ParentPool: { __typename?: 'ResourcePool', id: string, Name: string } }> } } | null> } };

export type SelectAllocationStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type SelectAllocationStrategiesQuery = { __typename?: 'Query', QueryAllocationStrategies: Array<{ __typename?: 'AllocationStrategy', id: string, Name: string }> };

export type RequiredPoolPropertiesQueryVariables = Exact<{
  allocationStrategyName: Scalars['String']['input'];
}>;


export type RequiredPoolPropertiesQuery = { __typename?: 'Query', QueryRequiredPoolProperties: Array<{ __typename?: 'PropertyType', Name: string, Type: string, FloatVal: number | null, IntVal: number | null, StringVal: string | null }> };

export type CreateAllocationStrategyAndResourceTypeMutationVariables = Exact<{
  stratInput: CreateAllocationStrategyInput;
  resourceTypeInput: CreateResourceTypeInput;
}>;


export type CreateAllocationStrategyAndResourceTypeMutation = { __typename?: 'Mutation', createStrat: { __typename?: 'CreateAllocationStrategyPayload', strategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string } | null }, createResourceType: { __typename?: 'CreateResourceTypePayload', resourceType: { __typename?: 'ResourceType', id: string, Name: string } } };

export type GetPoolAggregatesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  tags?: InputMaybe<TagOr>;
}>;


export type GetPoolAggregatesQuery = { __typename?: 'Query', QueryRootResourcePools: { __typename?: 'ResourcePoolConnection', totalCount: number, edges: Array<{ __typename?: 'ResourcePoolEdge', node: { __typename?: 'ResourcePool', id: string, Name: string, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, ResourceType: { __typename?: 'ResourceType', id: string, Name: string } } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor: { __typename?: 'OutputCursor', ID: string } | null, startCursor: { __typename?: 'OutputCursor', ID: string } | null } } };

export type DeleteIpPoolMutationVariables = Exact<{
  input: DeleteResourcePoolInput;
}>;


export type DeleteIpPoolMutation = { __typename?: 'Mutation', DeleteResourcePool: { __typename?: 'DeleteResourcePoolPayload', resourcePoolId: string } };

export type GetPoolIpRangesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
}>;


export type GetPoolIpRangesQuery = { __typename?: 'Query', QueryRootResourcePools: { __typename?: 'ResourcePoolConnection', totalCount: number, edges: Array<{ __typename?: 'ResourcePoolEdge', node: { __typename?: 'ResourcePool', id: string, Name: string, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, ResourceType: { __typename?: 'ResourceType', id: string, Name: string } } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor: { __typename?: 'OutputCursor', ID: string } | null, startCursor: { __typename?: 'OutputCursor', ID: string } | null } } };

export type DeleteResourcePoolMutationVariables = Exact<{
  input: DeleteResourcePoolInput;
}>;


export type DeleteResourcePoolMutation = { __typename?: 'Mutation', DeleteResourcePool: { __typename?: 'DeleteResourcePoolPayload', resourcePoolId: string } };

export type GetAllIpPoolsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  tags?: InputMaybe<TagOr>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
}>;


export type GetAllIpPoolsQuery = { __typename?: 'Query', QueryRootResourcePools: { __typename?: 'ResourcePoolConnection', totalCount: number, edges: Array<{ __typename?: 'ResourcePoolEdge', node: { __typename?: 'ResourcePool', id: string, Name: string, PoolType: PoolType, PoolProperties: any, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string, Lang: AllocationStrategyLang, Script: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, allocatedResources: { __typename?: 'ResourceConnection', totalCount: number } | null, Resources: Array<{ __typename?: 'Resource', id: string, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor: { __typename?: 'OutputCursor', ID: string } | null, startCursor: { __typename?: 'OutputCursor', ID: string } | null } } };

export type GetResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetResourceTypesQuery = { __typename?: 'Query', QueryResourceTypes: Array<{ __typename?: 'ResourceType', id: string, Name: string }> };

export type GetAllPoolsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  tags?: InputMaybe<TagOr>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
}>;


export type GetAllPoolsQuery = { __typename?: 'Query', QueryRootResourcePools: { __typename?: 'ResourcePoolConnection', totalCount: number, edges: Array<{ __typename?: 'ResourcePoolEdge', node: { __typename?: 'ResourcePool', id: string, Name: string, DealocationSafetyPeriod: number, PoolType: PoolType, PoolProperties: any, ParentResource: { __typename?: 'Resource', id: string } | null, allocatedResources: { __typename?: 'ResourceConnection', totalCount: number } | null, Tags: Array<{ __typename?: 'Tag', id: string, Tag: string }>, AllocationStrategy: { __typename?: 'AllocationStrategy', id: string, Name: string } | null, ResourceType: { __typename?: 'ResourceType', id: string, Name: string }, Resources: Array<{ __typename?: 'Resource', id: string, Properties: any, NestedPool: { __typename?: 'ResourcePool', id: string, Name: string } | null }>, Capacity: { __typename?: 'PoolCapacityPayload', freeCapacity: string, utilizedCapacity: string } | null } } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor: { __typename?: 'OutputCursor', ID: string } | null, startCursor: { __typename?: 'OutputCursor', ID: string } | null } } };

export type ResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type ResourceTypesQuery = { __typename?: 'Query', QueryResourceTypes: Array<{ __typename?: 'ResourceType', id: string, Name: string }> };

export type DeleteResourceTypeMutationVariables = Exact<{
  input: DeleteResourceTypeInput;
}>;


export type DeleteResourceTypeMutation = { __typename?: 'Mutation', DeleteResourceType: { __typename?: 'DeleteResourceTypePayload', resourceTypeId: string } };

export type DeleteStrategyMutationVariables = Exact<{
  input: DeleteAllocationStrategyInput;
}>;


export type DeleteStrategyMutation = { __typename?: 'Mutation', DeleteAllocationStrategy: { __typename?: 'DeleteAllocationStrategyPayload', strategy: { __typename?: 'AllocationStrategy', id: string } | null } };

export type GetAllocationStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllocationStrategiesQuery = { __typename?: 'Query', QueryAllocationStrategies: Array<{ __typename?: 'AllocationStrategy', id: string, Name: string }> };
