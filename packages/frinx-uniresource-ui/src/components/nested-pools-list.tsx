import React, { FC } from 'react';
import { useQuery } from 'urql';
import { Box } from '@chakra-ui/react';
import { Resource, ResourcePool } from '../generated/graphql';

const query = `query QueryAllPools {
    QueryRootResourcePools {
        id
        Name
        Resources {
          id
          Properties
          NestedPool {
            id
            Name
            PoolType
            Resources {
              id
              Properties
              NestedPool {
                id
                Name
                PoolType
              }
            }
          }
        }
      }
}`;

const NestedPoolsList: FC = () => {
  const [result] = useQuery({
    query,
  });

  type NestedPoolProps = {
    pool: ResourcePool;
  };

  const NestedPool = ({ pool }: NestedPoolProps) => {
    const { id, Name, Resources } = pool;
    return (
      <div>
        {Name} : {id}
        {Resources?.map((resource: Resource) => (
          <Box key={resource.id} marginLeft={15}>
            {resource.NestedPool ? <NestedPool pool={resource.NestedPool} /> : null}
          </Box>
        ))}
      </div>
    );
  };

  const { data } = result;

  return (
    <div>
      NESTED
      <ul>
        {data?.QueryRootResourcePools?.map((pool: ResourcePool) => (
          <li key={pool.id}>
            {pool.Name} : {pool.id}
            {pool.Resources.length}
            {pool.Resources.map((resource: Resource) => (
              <Box key={resource.id} marginLeft={15}>
                {resource.NestedPool ? <NestedPool pool={resource.NestedPool} /> : null}
              </Box>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NestedPoolsList;
