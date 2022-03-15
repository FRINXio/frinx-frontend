import React, { FunctionComponent } from 'react';
import { IconButton, Progress, Table, Tag, Tbody, Td, Text, Th, Thead, Tr, Icon, HStack } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { ChevronDownIcon, ChevronUpIcon, SettingsIcon } from '@chakra-ui/icons';
import { PoolCapacityPayload, QueryAllPoolsQuery } from '../../__generated__/graphql';
import { PoolDetail } from './pool-detail';

type Props = {
  pools?: QueryAllPoolsQuery['QueryResourcePools'];
  isLoading: boolean;
  detailId: string | null;
  onDeleteBtnClick: (id: string) => void;
  onPoolNameClick: (poolId: string) => void;
  onRowClick: (id: string, isDetailOpen: boolean) => void;
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

const PoolsTable: FunctionComponent<Props> = ({
  pools,
  onDeleteBtnClick,
  isLoading,
  onPoolNameClick,
  onRowClick,
  detailId,
}) => {
  return (
    <Table background="white">
      <Thead>
        <Tr>
          <Th />
          <Th>Name</Th>
          <Th>Pool Type</Th>
          <Th>Tags</Th>
          <Th>Resource Type</Th>
          <Th>Utilized Capacity</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <>
        {isLoading ? null : (
          <Tbody>
            {pools !== undefined && pools.length > 0 ? (
              pools.map((pool) => {
                const { Capacity } = pool;
                const capacityValue = getCapacityValue(Capacity);
                const totalCapacity = getTotalCapacity(Capacity);
                const isDetailOpen = pool.id === detailId;

                return (
                  <React.Fragment key={pool.id}>
                    <Tr key={pool.id} onClick={() => onRowClick(pool.id, !isDetailOpen)} cursor="pointer">
                      <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
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
                            isDisabled={Capacity?.freeCapacity !== totalCapacity}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                    {isDetailOpen && (
                      <Tr key={`${pool.id}-detail`}>
                        <Td colSpan={9}>
                          <PoolDetail resourcePool={pool} onPoolClick={onPoolNameClick} />
                        </Td>
                      </Tr>
                    )}
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
      </>
    </Table>
  );
};

export default PoolsTable;
