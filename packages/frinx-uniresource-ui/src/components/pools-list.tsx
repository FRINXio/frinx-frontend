import React, { FC } from 'react';
import { useQuery } from 'urql';
import { Query } from '../__generated__/graphql';
import DeletePool from './delete-pool';
import ClaimResource from './claim-resource';
import FreeResource from './free-resource';
import CreateNestedPool from './create-nested-pool';
import NestedPoolsList from './nested-pools-list';

const query = `query QueryAllPools {
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

const PoolsList: FC = () => {
  const [result] = useQuery<Query>({
    query,
  });

  const { data } = result;

  return (
    <div>
      <DeletePool />
      <ClaimResource />
      <FreeResource />
      <CreateNestedPool />
      <ul>
        {data?.QueryResourcePools?.map((pool) => (
          <li key={pool.id}>
            {pool.Name} : {pool.PoolType.toString()} : {pool.id}
          </li>
        ))}
      </ul>
      <NestedPoolsList />
    </div>
  );
};

export default PoolsList;
