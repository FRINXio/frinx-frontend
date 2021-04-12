import React, { FC } from 'react';
import { useQuery } from 'urql';
import { Box } from '@chakra-ui/react';
import { Query, Resource } from '../__generated__/graphql';
import NestedPool from './nested-pool';

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
  const [result] = useQuery<Query>({
    query,
  });

  const { data } = result;

  console.log(result);

  return (
    <div>
      NESTED
      <ul>
        {data?.QueryRootResourcePools?.map((pool) => (
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
