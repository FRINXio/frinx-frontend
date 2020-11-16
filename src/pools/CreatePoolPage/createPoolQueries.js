import {
  createAllocationPool, createSetPool, createSingletonPool, fetchQuery,
} from '../../queries/Queries';
import CreateAllocationPoolMutation from '../../mutations/createPools/CreateAllocationPoolMutation';

// eslint-disable-next-line camelcase
export const parseObject_toGraphQL = (obj) => {
  if (Array.isArray(obj)) {
    let parsedString = '[';
    // eslint-disable-next-line array-callback-return
    obj.map((o) => {
      parsedString += '{';
      // eslint-disable-next-line array-callback-return
      Object.keys(o).map((k) => {
        if (Number.isInteger(o[k])) {
          parsedString += `${k}: ${o[k]},`;
        } else {
          parsedString += `${k}: "${o[k]}",`;
        }
      });
      parsedString += '}';
    });
    parsedString += ']';
    return parsedString;
  }

  let parsedString = '';
  // eslint-disable-next-line array-callback-return
  Object.keys(obj).map((k) => {
    parsedString += `${k}: "${obj[k]}",`;
  });
  return parsedString;
};

// eslint-disable-next-line consistent-return
export const createPool = (pool) => {
  // eslint-disable-next-line default-case
  switch (pool.poolType) {
    case 'set':
      // eslint-disable-next-line no-use-before-define
      return postCreateSetPool(pool);
    case 'allocating':
      return new Promise((resolve, reject) => {
        CreateAllocationPoolMutation({
          input: {
            resourceTypeId: pool.resourceType.id,
            poolName: pool.poolName,
            description: pool.description,
            allocationStrategyId: pool.allocationStrategy.id,
            poolDealocationSafetyPeriod: pool.dealocationPeriod,
            poolProperties: pool.poolProperties,
            poolPropertyTypes: pool.poolPropertyTypes,
          },
        }, (response, err) => {
          if (err) reject(err);
          resolve(response, err);
        });
      });
      // return postCreateAllocatingPool(pool);
    case 'singleton':
      // eslint-disable-next-line no-use-before-define
      return postCreateSingletonPool(pool);
  }
};

export const postCreateSetPool = (pool) => {
  const {
    poolName, description, resourceType, dealocationPeriod, poolValues,
  } = pool;

  // eslint-disable-next-line max-len
  return fetchQuery(createSetPool(resourceType.id, poolName, description, parseObject_toGraphQL(poolValues), dealocationPeriod))
    .then((res) => res.data).catch((error) => error); // TODO error handling);
};

export const postCreateAllocatingPool = (pool) => {
  const {
    poolName, description, allocationStrategy, resourceType, dealocationPeriod,
  } = pool;

  // eslint-disable-next-line max-len
  return fetchQuery(createAllocationPool(resourceType.id, poolName, description, allocationStrategy.id, dealocationPeriod))
    .then((res) => res.data).catch((error) => error); // TODO error handling);
};

export const postCreateSingletonPool = (pool) => {
  const {
    poolName, description, resourceType, poolValues,
  } = pool;

  // eslint-disable-next-line max-len
  return fetchQuery(createSingletonPool(resourceType.id, poolName, description, parseObject_toGraphQL(poolValues))).then((res) => res.data).catch((error) => error); // TODO error handling);
};
