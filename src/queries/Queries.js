import * as axios from 'axios';

const BASIC_URL = '/resourcemanager/graphql/query';

export function fetchQuery(query) {
  return axios.post(
    BASIC_URL,
    {
      query,
    },
  );
}

export const queryAllocationStrats = `query queryAllocationStrats {
        QueryAllocationStrategies{
            ID
            Name
            Lang
            Script
        }
    }
    `;

export const createAllocationStrat = (input) => (
  `mutation createAllocationStrat {
    CreateAllocationStrategy(
        input: ${
  input
  }
    ){
        ID
        Name
        Lang
        Script
    }
}`
);

export const queryAllPools = `query QueryAllPools {
    QueryResourcePools{
        id
        Name
        PoolType
        Tags {
            id
            Tag
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
        Capacity {
          freeCapacity
          utilizedCapacity
        }
    }
}`;

export const queryRootPools = `query QueryRootResourcePools {
    QueryRootResourcePools{
        id
        Name
        PoolType
        Tags {
            id
            Tag
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
        Capacity {
          freeCapacity
          utilizedCapacity
        }
    }
}`;

export const queryFilterOptions = `query queryFilterOptions {
    QueryTags {
        id
        Tag
        Pools {
            id
            Name
        }
    },
    QueryAllocationStrategies{ 
        id
        Name
        Lang
        Script
    },
    QueryResourceTypes {
      id
      Name
      PropertyTypes {
            Name
            Type
        }
        Pools {
            id
            Name
        }
    }
}`;

export const queryResourceTypes = `
  query queryResourceTypes {
    QueryResourceTypes {
      id
      Name
      PropertyTypes {
            Name
            Type
        }
        Pools {
            id
            Name
        }
    }
  }
`;

export const createNewResourceType = (input) => (
  `mutation createNewResourceType {
        CreateResourceType(
            input: ${
  input
  }
    ) {
            ID
            Name
        }
    }`
);
export const deleteResourceType = (id) => (
  `mutation deleteResourceType {
          DeleteResourceType(
            resourceTypeId: "${
  id
  }",
      )
      }`
);

export const createComplexResourceType = `mutation createComplexResourceType {
    CreateResourceType(
        resourceName: "complex",
        resourceProperties: {
        a: "int",
            b: "string"
    }
) {
        ID
        Name
    }
}`;

export const tagPool = (tagId, poolId) => `mutation TagPool {
    TagPool(input: {tagId: ${tagId} , poolId: ${poolId}}) {
        tag {
            id
        }
    }
}`;

export const untagPool = (tagId, poolId) => `mutation UntagPool {
    UntagPool(input: {tagId: ${tagId} , poolId: ${poolId}}) {
        tag {
            id
        }
    }
}`;

export const createSetPool = (resourceTypeId, poolName, description, poolValues, poolDealocationSafetyPeriod) => `mutation createSetPool {
    CreateSetPool(input: {
        resourceTypeId: ${resourceTypeId},
        poolName: "${poolName}",
        description: "${description}",
        poolValues: ${poolValues},
        poolDealocationSafetyPeriod: ${poolDealocationSafetyPeriod}
}){
    pool {
        id
        PoolType
        Name
    }
  }
}`;

export const createAllocationPool = (resourceTypeId, poolName, description, allocationStrategyId, poolDealocationSafetyPeriod) => `mutation createAllocationPool {
    CreateAllocatingPool(input: {
        resourceTypeId: ${resourceTypeId},
        poolName: "${poolName}",
        description: "${description}",
        allocationStrategyId: ${allocationStrategyId},
        poolDealocationSafetyPeriod: ${poolDealocationSafetyPeriod}
}){
    pool {
        id
        PoolType
        Name
    }
  }
}`;

export const createSingletonPool = (resourceTypeId, poolName, description, poolValues) => `mutation createSingletonPool {
    CreateSingletonPool(input: {
        resourceTypeId: ${resourceTypeId},
        poolName: "${poolName}",
        description: "${description}",
        poolValues: ${poolValues}
}){
    pool {
        id
        PoolType
        Name
    }
  }
}`;

export const QueryAllPools = `query QueryAllPools {
    QueryResourcePools{
        ID
        Name
        PoolType
    }
}`;

export const QueryAllocatedResources = (poolID, first, after, before) => `query QueryAllocatedResources {
    QueryResourcePool(poolId: ${poolID}) {
        allocatedResources(first: ${first}, after: ${ (after) ? "\"" + after + "\"" : null}, before: ${ (before) ? "\"" + before + "\"" : null}) {
            pageInfo{
                endCursor {
                    ID
                }
                hasNextPage
                hasPreviousPage
                startCursor {
                    ID
                }
            }
            edges {
                cursor {
                    ID
                }
                node {
                    id
                    Description
                    NestedPool {
                        Name
                        id
                    }
                    Properties
                }
            }
            totalCount
        }
    }
}`;


export const ClaimResource = `mutation ClaimResource {
    ClaimResource(poolId:21474836480) {
        ID
        Properties
    }
}`;

export const ClaimResourceFromAllocatingPool = `mutation ClaimResourceFromAllocatingPool {
    ClaimResource(poolId:21474836481) {
        ID
        Properties
    }
}`;

export const QueryResources = `query QueryResources {
    QueryResources(poolId:21474836481){
        ID
        Properties
    }
}`;

export const deleteResourcePool = (resourcePoolId) => `mutation deleteResourcePool {
    DeleteResourcePool(input: {resourcePoolId: ${resourcePoolId}}) {
        resourcePoolId 
    }
}`;

export const deleteAllocationStrat = `mutation deleteAllocationStrat {
    DeleteAllocationStrategy(
        allocationStrategyId: 1,
){
        Name
    }
}`;
