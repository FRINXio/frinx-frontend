import React, { FunctionComponent } from 'react';
import { IconButton, Progress, Table, Tag, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { PoolCapacityPayload, QueryAllPoolsQuery } from '../../__generated__/graphql';

type Props = {
  pools: QueryAllPoolsQuery['QueryResourcePools'];
  onDeleteBtnClick: (id: string) => void;
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

const PoolsTable: FunctionComponent<Props> = ({ pools, onDeleteBtnClick }) => {
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
          {pools.map((pool) => {
            const capacityValue = getCapacityValue(pool.Capacity);
            const { freeCapacity, utilizedCapacity } = pool.Capacity;
            const totalCapacity = freeCapacity + utilizedCapacity;

            return (
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
                <Td isNumeric>
                  <Progress size="xs" value={capacityValue} />
                  <Text as="span" fontSize="xs" color="gray.600" fontWeight={500}>
                    {freeCapacity} / {totalCapacity}
                  </Text>
                </Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="delete"
                    type="button"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                      onDeleteBtnClick(pool.id);
                    }}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

export default PoolsTable;
