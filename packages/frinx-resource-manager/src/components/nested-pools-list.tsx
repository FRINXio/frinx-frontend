import React, { FC } from 'react';
import { useQuery } from 'urql';
import { Box } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { AllPoolsNestedQuery, AllPoolsNestedQueryVariables } from '../__generated__/graphql';
import NestedPool from './nested-pool';

const query = gql`
  query AllPoolsNested {
    QueryRootResourcePools {
      edges {
        node {
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
              }
            }
          }
        }
      }
    }
  }
`;

const NestedPoolsList: FC = () => {
  const [{ data: nestedPools }] = useQuery<AllPoolsNestedQuery, AllPoolsNestedQueryVariables>({
    query,
  });

  const pools = nestedPools?.QueryRootResourcePools.edges.map((e) => {
    return e?.node;
  });

  return (
    <div>
      NESTED
      <ul>
        {pools !== undefined &&
          pools?.map((pool) => (
            <li key={pool?.id}>
              {pool?.Name} : {pool?.id}
              {pool?.Resources.length}
              {pool?.Resources.map((resource) => (
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
