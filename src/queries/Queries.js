// @flow
import * as axios from 'axios';
// import {graphql} from 'babel-plugin-relay/macro';

const BASIC_URL = 'http://localhost:8884/query';

const headers = {
  "x-tenant-id": "fb",
  "x-auth-user-role": "OWNER",
  "from": "fb-user@frinx.io"
};

export function fetchQuery(query) {
  return axios.post(
    BASIC_URL,
    {
      query,
    },
    {headers},
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

export const createAllocationStrat = name => {
  return (
    `mutation createAllocationStrat {
    CreateAllocationStrategy(
        name: "` +
    name +
    `",
        script: "function invoke() { return {` +
    'vlan' +
    `: 101}; }"
    ){
        ID
        Name
        Lang
        Script
    }
}`
  );
};

export const queryAllPools = `query QueryAllPools {
    QueryResourcePools{
        ID
        Name
        PoolType
    }
}`;

export const queryResourceTypes = `
  query queryResourceTypes {
    QueryResourceTypes {
      ID
      Name
      Edges {
        PropertyTypes {
          Name
          Type
        }
      }
    }
  }
`;

export const createNewResourceType = name => {
  return (
    `mutation createNewResourceType {
        CreateResourceType(
            resourceName: "` +
    name +
    `",
            resourceProperties: {
            vlan: "int"
        }
    ) {
            ID
            Name
        }
    }`
  );
};

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

export const createSetPool = `mutation createSetPool {
    CreateSetPool(
        resourceTypeId: 25769803776,
        poolName: "vlan_test5",
        poolValues: [{vlan: 13}, {vlan: 14},],
        poolDealocationSafetyPeriod: 0
){
        ID
        PoolType
        Name
    }
}`;

export const createAllocationPool = `mutation createAllocationPool {
    CreateAllocatingPool(
        resourceTypeId: 25769803776,
        poolName: "vlan_allocating",
        allocationStrategyId: 1,
        poolDealocationSafetyPeriod: 0
){
        ID
        PoolType
        Name
    }
}`;

export const QueryAllPools = `query QueryAllPools {
    QueryResourcePools{
        ID
        Name
        PoolType
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

export const deleteResourcePool = `mutation deleteResourcePool {
    DeleteResourcePool(resourcePoolId:21474836481)
}`;

export const deleteAllocationStrat = `mutation deleteAllocationStrat {
    DeleteAllocationStrategy(
        allocationStrategyId: 1,
){
        Name
    }
}`;
