import React, { FC } from 'react';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { Progress, Table, Tag, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { PoolCapacityPayload, QueryAllPoolsQuery } from '../__generated__/graphql';
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

  function getCapacityValue(capacity: Pick<PoolCapacityPayload, 'freeCapacity' | 'utilizedCapacity'>) {
    const { freeCapacity, utilizedCapacity } = capacity;
    const totalCapacity = freeCapacity + utilizedCapacity;
    if (totalCapacity === 0) return 0;
    return (utilizedCapacity / totalCapacity) * 100;
  }

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
                  <Tag key={t.id} marginRight={1}>
                    {t.Tag}
                  </Tag>
                ))}
              </Td>
              <Td>{pool.ResourceType?.Name}</Td>
              <Td>
                <Progress size="xs" value={pool.Capacity ? getCapacityValue(pool.Capacity) : 0} />
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
