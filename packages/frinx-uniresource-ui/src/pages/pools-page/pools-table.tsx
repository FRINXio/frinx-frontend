import React, { FunctionComponent } from 'react';
import { IconButton, Progress, Table, Tag, Tbody, Td, Text, Th, Thead, Tr, Icon, HStack } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons';
import { PoolCapacityPayload, GetAllPoolsQuery } from '../../__generated__/graphql';

type Props = {
  pools?: GetAllPoolsQuery['QueryResourcePools'];
  isLoading: boolean;
  onDeleteBtnClick: (id: string) => void;
  onPoolNameClick: (poolId: string) => void;
  onRowClick: (poolId: string) => void;
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

const PoolsTable: FunctionComponent<Props> = ({ pools, onDeleteBtnClick, isLoading, onPoolNameClick, onRowClick }) => {
  return (
    <Table background="white">
      <Thead>
        <Tr>
          <Th>Children</Th>
          <Th>Name</Th>
          <Th>Tags</Th>
          <Th>Pool Type</Th>
          <Th>Resource Type</Th>
          <Th>Utilized Capacity</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {isLoading ? null : (
        <Tbody>
          {pools !== undefined && pools.length > 0 ? (
            pools.map((pool) => {
              const capacityValue = getCapacityValue(pool.Capacity);
              const totalCapacity = getTotalCapacity(pool.Capacity);
              const amountOfNestedPools = pool.Resources.filter((resource) => resource.NestedPool != null).length;
              const hasNestedPools = amountOfNestedPools > 0;

              return (
                <React.Fragment key={pool.id}>
                  <Tr
                    key={pool.id}
                    onClick={() => hasNestedPools && onRowClick(pool.id)}
                    cursor={hasNestedPools ? 'pointer' : 'default'}
                  >
                    <Td>
                      {hasNestedPools ? (
                        <>
                          <Icon as={ChevronDownIcon} /> {amountOfNestedPools}
                        </>
                      ) : null}
                    </Td>
                    <Td>
                      <Text as="span" fontWeight={600}>
                        {pool.Name}
                      </Text>
                    </Td>
                    <Td>
                      {pool.Tags?.map((t) => (
                        <Tag key={t.id} marginRight={1}>
                          {t.Tag}
                        </Tag>
                      ))}
                    </Td>
                    <Td>{pool.PoolType}</Td>
                    <Td>
                      <Text as="span" fontFamily="monospace" color="red">
                        {pool.ResourceType?.Name}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <Progress size="xs" value={capacityValue} />
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
                        <IconButton
                          variant="outline"
                          colorScheme="red"
                          aria-label="delete"
                          icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                          onClick={() => {
                            onDeleteBtnClick(pool.id);
                          }}
                          isDisabled={pool.Capacity?.freeCapacity !== totalCapacity}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })
          ) : (
            <Tr textAlign="center">
              <Td>There are no resource pools</Td>
            </Tr>
          )}
        </Tbody>
      )}
    </Table>
  );
};

export default PoolsTable;
