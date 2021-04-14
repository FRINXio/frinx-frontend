import React, { FC } from 'react';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { Progress, Table, Tag, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { QueryAllPoolsQuery } from '../__generated__/graphql';
import CreateNestedPool from './create-nested-pool';
import DeletePool from './delete-pool';

const query = gql`
  query QueryAllPools {
    QueryResourcePools {
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
  }
`;

const PoolsList: FC = () => {
  const [result] = useQuery<QueryAllPoolsQuery>({
    query,
  });

  const { data } = result;

  return (
    <div>
      <CreateNestedPool />
      <Table background="white">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Pool Type</Th>
            <Th>Tags</Th>
            <Th>Resource Type</Th>
            <Th>Utilized Capacity</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.QueryResourcePools?.map((pool) => (
            <Tr key={pool.id}>
              <Td>{pool.Name}</Td>
              <Td>{pool.PoolType}</Td>
              <Td>
                {pool.Tags?.map((t) => (
                  <Tag key={t.id} marginRight={1}>{t.Tag}</Tag>
                ))}
              </Td>
              <Td>{pool.ResourceType?.Name}</Td>
              <Td>
                {/* Static for now */}
                <Progress size="xs" value={80} />
              </Td>
              <Td>
                <DeletePool poolId={pool.id} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default PoolsList;
