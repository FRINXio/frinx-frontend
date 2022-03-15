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
  pool: Maybe<ResourcePool>;
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
  strategy: Maybe<AllocationStrategy>;
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
  pool: Maybe<ResourcePool>;
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
  pool: Maybe<ResourcePool>;
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
  pool: Maybe<ResourcePool>;
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
  CreateTag: CreateTagPayload;
  UpdateTag: UpdateTagPayload;
  DeleteTag: DeleteTagPayload;
  TagPool: TagPoolPayload;
  UntagPool: UntagPoolPayload;
  CreateAllocationStrategy: CreateAllocationStrategyPayload;
  DeleteAllocationStrategy: DeleteAllocationStrategyPayload;
  TestAllocationStrategy: Scalars['Map'];
  ClaimResource: Resource;
  ClaimResourceWithAltId: Resource;
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


export type MutationClaimResourceWithAltIdArgs = {
  poolId: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  userInput: Scalars['Map'];
  alternativeId: Scalars['Map'];
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
  freeCapacity: Scalars['Float'];
  utilizedCapacity: Scalars['Float'];
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
  QueryPoolCapacity: PoolCapacityPayload;
  QueryPoolTypes: Array<PoolType>;
  QueryResource: Resource;
  QueryResources: Array<Resource>;
  QueryResourceByAltId: Resource;
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
  node: Maybe<Node>;
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


export type QueryQueryResourceByAltIdArgs = {
  input: Scalars['Map'];
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

/** Represents an allocated resource */
export type Resource = Node & {
  __typename?: 'Resource';
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
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
};

/** Convenience entity representing the identity of a pool in some calls */
export type ResourcePoolInput = {
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
  tagId: Scalars['ID'];
  poolId: Scalars['ID'];
};

/** Output of adding a specific tag to a pool */
export type TagPoolPayload = {
  __typename?: 'TagPoolPayload';
  tag: Maybe<Tag>;
};

/** Input parameters for a call removing a tag from pool */
export type UntagPoolInput = {
  tagId: Scalars['ID'];
  poolId: Scalars['ID'];
};

/** Output of removing a specific tag from a pool */
export type UntagPoolPayload = {
  __typename?: 'UntagPoolPayload';
  tag: Maybe<Tag>;
};

/** Input parameters updating the name of a resource-type */
export type UpdateResourceTypeNameInput = {
  resourceTypeId: Scalars['ID'];
  resourceName: Scalars['String'];
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
  description?: Maybe<Scalars['String']>;
  userInput: Scalars['Map'];
}>;


export type ClaimResourceMutationMutation = (
  { __typename?: 'Mutation' }
  & { ClaimResource: (
    { __typename?: 'Resource' }
    & Pick<Resource, 'id'>
  ) }
);

export type CreateNestedPoolMutationMutationVariables = Exact<{
  input: CreateNestedSetPoolInput;
}>;


export type CreateNestedPoolMutationMutation = (
  { __typename?: 'Mutation' }
  & { CreateNestedSetPool: (
    { __typename?: 'CreateNestedSetPoolPayload' }
    & { pool: Maybe<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id'>
    )> }
  ) }
);

export type AddResourceTypeMutationMutationVariables = Exact<{
  input: CreateResourceTypeInput;
}>;


export type AddResourceTypeMutationMutation = (
  { __typename?: 'Mutation' }
  & { CreateResourceType: (
    { __typename?: 'CreateResourceTypePayload' }
    & { resourceType: (
      { __typename?: 'ResourceType' }
      & Pick<ResourceType, 'Name'>
    ) }
  ) }
);

export type AddStrategyMutationMutationVariables = Exact<{
  input: CreateAllocationStrategyInput;
}>;


export type AddStrategyMutationMutation = (
  { __typename?: 'Mutation' }
  & { CreateAllocationStrategy: (
    { __typename?: 'CreateAllocationStrategyPayload' }
    & { strategy: Maybe<(
      { __typename?: 'AllocationStrategy' }
      & Pick<AllocationStrategy, 'id' | 'Name' | 'Lang' | 'Script'>
    )> }
  ) }
);

export type DeletePoolMutationMutationVariables = Exact<{
  input: DeleteResourcePoolInput;
}>;


export type DeletePoolMutationMutation = (
  { __typename?: 'Mutation' }
  & { DeleteResourcePool: (
    { __typename?: 'DeleteResourcePoolPayload' }
    & Pick<DeleteResourcePoolPayload, 'resourcePoolId'>
  ) }
);

export type DeleteResourceTypeMutationMutationVariables = Exact<{
  input: DeleteResourceTypeInput;
}>;


export type DeleteResourceTypeMutationMutation = (
  { __typename?: 'Mutation' }
  & { DeleteResourceType: (
    { __typename?: 'DeleteResourceTypePayload' }
    & Pick<DeleteResourceTypePayload, 'resourceTypeId'>
  ) }
);

export type DeleteStrategyMutationMutationVariables = Exact<{
  input: DeleteAllocationStrategyInput;
}>;


export type DeleteStrategyMutationMutation = (
  { __typename?: 'Mutation' }
  & { DeleteAllocationStrategy: (
    { __typename?: 'DeleteAllocationStrategyPayload' }
    & { strategy: Maybe<(
      { __typename?: 'AllocationStrategy' }
      & Pick<AllocationStrategy, 'id'>
    )> }
  ) }
);

export type FreeResourceMutationMutationVariables = Exact<{
  poolId: Scalars['ID'];
  input: Scalars['Map'];
}>;


export type FreeResourceMutationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'FreeResource'>
);

export type QueryAllPoolsNestedQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllPoolsNestedQuery = (
  { __typename?: 'Query' }
  & { QueryRootResourcePools: Array<(
    { __typename?: 'ResourcePool' }
    & Pick<ResourcePool, 'id' | 'Name'>
    & { Resources: Array<(
      { __typename?: 'Resource' }
      & Pick<Resource, 'id' | 'Properties'>
      & { NestedPool: Maybe<(
        { __typename?: 'ResourcePool' }
        & Pick<ResourcePool, 'id' | 'Name' | 'PoolType'>
        & { Resources: Array<(
          { __typename?: 'Resource' }
          & Pick<Resource, 'id' | 'Properties'>
        )> }
      )> }
    )> }
  )> }
);

export type ResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type ResourceTypesQuery = (
  { __typename?: 'Query' }
  & { QueryResourceTypes: Array<(
    { __typename?: 'ResourceType' }
    & Pick<ResourceType, 'id' | 'Name'>
    & { PropertyTypes: Array<(
      { __typename?: 'PropertyType' }
      & Pick<PropertyType, 'Name' | 'Type'>
    )>, Pools: Array<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id' | 'Name'>
    )> }
  )> }
);

export type QueryAllocationStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllocationStrategiesQuery = (
  { __typename?: 'Query' }
  & { QueryAllocationStrategies: Array<(
    { __typename?: 'AllocationStrategy' }
    & Pick<AllocationStrategy, 'id' | 'Name' | 'Lang' | 'Script'>
  )> }
);

export type CreateSetPoolMutationVariables = Exact<{
  input: CreateSetPoolInput;
}>;


export type CreateSetPoolMutation = (
  { __typename?: 'Mutation' }
  & { CreateSetPool: (
    { __typename?: 'CreateSetPoolPayload' }
    & { pool: Maybe<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id'>
    )> }
  ) }
);

export type CreateNestedSetPoolMutationVariables = Exact<{
  input: CreateNestedSetPoolInput;
}>;


export type CreateNestedSetPoolMutation = (
  { __typename?: 'Mutation' }
  & { CreateNestedSetPool: (
    { __typename?: 'CreateNestedSetPoolPayload' }
    & { pool: Maybe<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id'>
    )> }
  ) }
);

export type CreateSingletonPoolMutationVariables = Exact<{
  input: CreateSingletonPoolInput;
}>;


export type CreateSingletonPoolMutation = (
  { __typename?: 'Mutation' }
  & { CreateSingletonPool: (
    { __typename?: 'CreateSingletonPoolPayload' }
    & { pool: Maybe<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id'>
    )> }
  ) }
);

export type CreateNestedSingletonPoolMutationVariables = Exact<{
  input: CreateNestedSingletonPoolInput;
}>;


export type CreateNestedSingletonPoolMutation = (
  { __typename?: 'Mutation' }
  & { CreateNestedSingletonPool: (
    { __typename?: 'CreateNestedSingletonPoolPayload' }
    & { pool: Maybe<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id'>
    )> }
  ) }
);

export type CreateAllocationPoolMutationVariables = Exact<{
  input: CreateAllocatingPoolInput;
}>;


export type CreateAllocationPoolMutation = (
  { __typename?: 'Mutation' }
  & { CreateAllocatingPool: (
    { __typename?: 'CreateAllocatingPoolPayload' }
    & { pool: Maybe<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id'>
    )> }
  ) }
);

export type CreateNestedAllocationPoolMutationVariables = Exact<{
  input: CreateNestedAllocatingPoolInput;
}>;


export type CreateNestedAllocationPoolMutation = (
  { __typename?: 'Mutation' }
  & { CreateNestedAllocatingPool: (
    { __typename?: 'CreateNestedAllocatingPoolPayload' }
    & { pool: Maybe<(
      { __typename?: 'ResourcePool' }
      & Pick<ResourcePool, 'id'>
    )> }
  ) }
);

export type SelectResourceTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type SelectResourceTypesQuery = (
  { __typename?: 'Query' }
  & { QueryResourceTypes: Array<(
    { __typename?: 'ResourceType' }
    & Pick<ResourceType, 'Name' | 'id'>
  )> }
);

export type SelectPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type SelectPoolsQuery = (
  { __typename?: 'Query' }
  & { QueryResourcePools: Array<(
    { __typename?: 'ResourcePool' }
    & Pick<ResourcePool, 'id' | 'Name'>
    & { ResourceType: (
      { __typename?: 'ResourceType' }
      & Pick<ResourceType, 'id' | 'Name'>
    ), Resources: Array<(
      { __typename?: 'Resource' }
      & Pick<Resource, 'Description' | 'Properties' | 'id'>
      & { ParentPool: (
        { __typename?: 'ResourcePool' }
        & Pick<ResourcePool, 'id' | 'Name'>
      ), NestedPool: Maybe<(
        { __typename?: 'ResourcePool' }
        & Pick<ResourcePool, 'id' | 'PoolProperties'>
      )> }
    )> }
  )> }
);

export type SelectAllocationStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type SelectAllocationStrategiesQuery = (
  { __typename?: 'Query' }
  & { QueryAllocationStrategies: Array<(
    { __typename?: 'AllocationStrategy' }
    & Pick<AllocationStrategy, 'id' | 'Name'>
  )> }
);

export type PoolDetailQueryVariables = Exact<{
  poolId: Scalars['ID'];
}>;


export type PoolDetailQuery = (
  { __typename?: 'Query' }
  & { QueryResourcePool: (
    { __typename?: 'ResourcePool' }
    & Pick<ResourcePool, 'id' | 'Name' | 'PoolType'>
    & { Resources: Array<(
      { __typename?: 'Resource' }
      & Pick<Resource, 'Description' | 'Properties' | 'id'>
      & { NestedPool: Maybe<(
        { __typename?: 'ResourcePool' }
        & Pick<ResourcePool, 'id' | 'Name' | 'PoolType' | 'PoolProperties'>
        & { Tags: Array<(
          { __typename?: 'Tag' }
          & Pick<Tag, 'id' | 'Tag'>
        )>, ParentResource: Maybe<(
          { __typename?: 'Resource' }
          & { ParentPool: (
            { __typename?: 'ResourcePool' }
            & Pick<ResourcePool, 'id' | 'Name'>
          ) }
        )>, AllocationStrategy: Maybe<(
          { __typename?: 'AllocationStrategy' }
          & Pick<AllocationStrategy, 'id' | 'Name' | 'Lang'>
        )>, ResourceType: (
          { __typename?: 'ResourceType' }
          & Pick<ResourceType, 'id' | 'Name'>
        ), Resources: Array<(
          { __typename?: 'Resource' }
          & Pick<Resource, 'id'>
          & { NestedPool: Maybe<(
            { __typename?: 'ResourcePool' }
            & Pick<ResourcePool, 'id' | 'Name'>
          )> }
        )>, Capacity: Maybe<(
          { __typename?: 'PoolCapacityPayload' }
          & Pick<PoolCapacityPayload, 'freeCapacity' | 'utilizedCapacity'>
        )> }
      )> }
    )>, Tags: Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'Tag'>
    )>, Capacity: Maybe<(
      { __typename?: 'PoolCapacityPayload' }
      & Pick<PoolCapacityPayload, 'freeCapacity' | 'utilizedCapacity'>
    )>, ResourceType: (
      { __typename?: 'ResourceType' }
      & Pick<ResourceType, 'id' | 'Name'>
    ) }
  ) }
);

export type AllocatedResourcesQueryVariables = Exact<{
  poolId: Scalars['ID'];
}>;


export type AllocatedResourcesQuery = (
  { __typename?: 'Query' }
  & { QueryResources: Array<(
    { __typename?: 'Resource' }
    & Pick<Resource, 'id' | 'Properties' | 'Description'>
  )> }
);

export type ClaimResourceMutationVariables = Exact<{
  poolId: Scalars['ID'];
  description: Scalars['String'];
  userInput: Scalars['Map'];
}>;


export type ClaimResourceMutation = (
  { __typename?: 'Mutation' }
  & { ClaimResource: (
    { __typename?: 'Resource' }
    & Pick<Resource, 'id' | 'Properties'>
  ) }
);

export type FreeResourceMutationVariables = Exact<{
  poolId: Scalars['ID'];
  input: Scalars['Map'];
}>;


export type FreeResourceMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'FreeResource'>
);

export type DeletePoolMutationVariables = Exact<{
  input: DeleteResourcePoolInput;
}>;


export type DeletePoolMutation = (
  { __typename?: 'Mutation' }
  & { DeleteResourcePool: (
    { __typename?: 'DeleteResourcePoolPayload' }
    & Pick<DeleteResourcePoolPayload, 'resourcePoolId'>
  ) }
);

export type QueryAllPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllPoolsQuery = (
  { __typename?: 'Query' }
  & { QueryResourcePools: Array<(
    { __typename?: 'ResourcePool' }
    & Pick<ResourcePool, 'id' | 'Name' | 'PoolType' | 'PoolProperties'>
    & { Tags: Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'Tag'>
    )>, ParentResource: Maybe<(
      { __typename?: 'Resource' }
      & { ParentPool: (
        { __typename?: 'ResourcePool' }
        & Pick<ResourcePool, 'id' | 'Name'>
      ) }
    )>, AllocationStrategy: Maybe<(
      { __typename?: 'AllocationStrategy' }
      & Pick<AllocationStrategy, 'id' | 'Name' | 'Lang'>
    )>, ResourceType: (
      { __typename?: 'ResourceType' }
      & Pick<ResourceType, 'id' | 'Name'>
    ), Resources: Array<(
      { __typename?: 'Resource' }
      & Pick<Resource, 'id'>
      & { NestedPool: Maybe<(
        { __typename?: 'ResourcePool' }
        & Pick<ResourcePool, 'id' | 'Name'>
      )> }
    )>, Capacity: Maybe<(
      { __typename?: 'PoolCapacityPayload' }
      & Pick<PoolCapacityPayload, 'freeCapacity' | 'utilizedCapacity'>
    )> }
  )> }
);

export type DeleteStrategyMutationVariables = Exact<{
  input: DeleteAllocationStrategyInput;
}>;


export type DeleteStrategyMutation = (
  { __typename?: 'Mutation' }
  & { DeleteAllocationStrategy: (
    { __typename?: 'DeleteAllocationStrategyPayload' }
    & { strategy: Maybe<(
      { __typename?: 'AllocationStrategy' }
      & Pick<AllocationStrategy, 'id'>
    )> }
  ) }
);
