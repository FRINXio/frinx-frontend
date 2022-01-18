import React, { FunctionComponent } from 'react';
import { IconButton, Progress, Table, Tag, Tbody, Td, Text, Th, Thead, Tr, Icon, HStack } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { SettingsIcon } from '@chakra-ui/icons';
import { PoolCapacityPayload, QueryAllPoolsQuery } from '../../__generated__/graphql';

type Props = {
  pools: QueryAllPoolsQuery['QueryResourcePools'] | null;
  isLoading: boolean;
  onDeleteBtnClick: (id: string) => void;
  onPoolNameClick: (poolId: string) => void;
};

function getTotalCapacity(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  return capacity.freeCapacity + capacity.utilizedCapacity;
}
function getCapacityValue(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  const totalCapacity = getTotalCapacity(capacity);
  if (totalCapacity === 0) {
    return 0;
  }
  return (capacity.utilizedCapacity / totalCapacity) * 100;
}

const PoolsTable: FunctionComponent<Props> = ({ pools, onDeleteBtnClick, isLoading, onPoolNameClick }) => {
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
          {!isLoading && !pools && (
            <Tr textAlign="center">
              <Td>There are no data</Td>
            </Tr>
          )}
          {pools &&
            pools.map((pool) => {
              const { Capacity } = pool;
              const capacityValue = getCapacityValue(Capacity);
              const totalCapacity = getTotalCapacity(Capacity);

              return (
                <Tr key={pool.id}>
                  <Td>
                    <Text as="span" fontWeight={600}>
                      {pool.Name}
                    </Text>
                  </Td>
                  <Td>{pool.PoolType}</Td>
                  <Td>
                    {pool.Tags?.map((t) => (
                      <Tag key={t.id} marginRight={1}>
                        {t.Tag}
                      </Tag>
                    ))}
                  </Td>
                  <Td>
                    <Text as="span" fontFamily="monospace" color="red">
                      {pool.ResourceType?.Name}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    <Progress size="xs" value={capacityValue} />
                    <Text as="span" fontSize="xs" color="gray.600" fontWeight={500}>
                      {Capacity?.freeCapacity ?? 0} / {totalCapacity}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="config"
                        size="sm"
                        variant="unstyled"
                        icon={<Icon size={12} as={SettingsIcon} />}
                        onClick={() => onPoolNameClick(pool.id)}
                      />
                      {/* <IconButton
                        aria-label="edit"
                        size="sm"
                        variant="unstyled"
                        icon={<Icon size={12} as={EditIcon} />}
                      /> */}
                      <IconButton
                        variant="outline"
                        colorScheme="red"
                        aria-label="delete"
                        icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                        onClick={() => {
                          onDeleteBtnClick(pool.id);
                        }}
                        isDisabled={Capacity?.freeCapacity !== totalCapacity}
                      />
                    </HStack>
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
