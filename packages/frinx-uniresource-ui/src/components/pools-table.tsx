import React, { FunctionComponent } from 'react';
import { Button, Progress, Table, Tag, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { PoolCapacityPayload, QueryAllPoolsQuery } from '../__generated__/graphql';

type Props = {
  pools: QueryAllPoolsQuery['QueryResourcePools'];
};

function getCapacityValue(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  const { freeCapacity, utilizedCapacity } = capacity;
  const totalCapacity = freeCapacity + utilizedCapacity;
  if (totalCapacity === 0) {
    return 0;
  }
  return (utilizedCapacity / totalCapacity) * 100;
}

const PoolsTable: FunctionComponent<Props> = ({ pools }) => {
  return (
    <>
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
          {pools.map((pool) => (
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
                <Button />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default PoolsTable;
