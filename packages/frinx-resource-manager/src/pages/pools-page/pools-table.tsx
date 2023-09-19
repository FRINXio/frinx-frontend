import {
  Button,
  HStack,
  Icon,
  IconButton,
  Progress,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import DeletePoolPopover from '../../components/delete-modal';
import { getTotalCapacity } from '../../helpers/resource-pool.helpers';
import { PoolCapacityPayload, Tag as TagType } from '../../__generated__/graphql';
import { SortBy } from './pools-page';

type PoolType = 'set' | 'allocating' | 'singleton';

type NestedPool = {
  id: string;
  Name: string;
};

type Resource = {
  id: string;
  NestedPool: NestedPool | null;
};

type Pools = {
  id: string;
  Name: string;
  AllocationStrategy: Record<string, string> | null;
  Capacity: PoolCapacityPayload | null;
  PoolProperties: Record<string, string | number | boolean>;
  PoolType: PoolType;
  DealocationSafetyPeriod?: number;
  ResourceType: Record<string, string>;
  Resources: Resource[];
  Tags: Omit<TagType, 'Pools'>[];
  allocatedResources?: Record<string, number | string> | null;
};

type Props = {
  onSort?: (sortKey: 'name' | 'dealocationSafetyPeriod') => void;
  sortBy?: SortBy;
  pools: Pools[];
  isLoading: boolean;
  isNestedShown?: boolean;
  onStrategyClick?: (name?: string) => void;
  onDeleteBtnClick: (id: string) => void;
  onTagClick?: (tag: string) => void;
};

const PoolsTable: VoidFunctionComponent<Props> = ({
  pools,
  onSort,
  sortBy,
  onDeleteBtnClick,
  onStrategyClick,
  isLoading,
  isNestedShown = true,
  onTagClick,
}) => {
  if (isLoading) {
    return <Progress isIndeterminate size="sm" />;
  }

  return (
    <Table data-cy="pool-details-nested" background="white" size="sm">
      <Thead bgColor="gray.200">
        <Tr>
          {isNestedShown && <Th>Children</Th>}
          <Th
            cursor="pointer"
            onClick={() => {
              if (onSort) {
                onSort('name');
              }
            }}
          >
            Name
            {sortBy?.sortKey === 'name' && (
              <Icon as={FeatherIcon} size={40} icon={sortBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th>
          <Th>Tags</Th>
          <Th>Pool Type</Th>
          <Th
            cursor="pointer"
            onClick={() => {
              if (onSort) {
                onSort('dealocationSafetyPeriod');
              }
            }}
          >
            Dealocation Safety Period{' '}
            {sortBy?.sortKey === 'dealocationSafetyPeriod' && (
              <Icon as={FeatherIcon} size={40} icon={sortBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th>
          <Th>Resource Type</Th>
          <Th>Utilized Capacity</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {isLoading ? null : (
        <Tbody>
          {pools.length > 0 ? (
            pools.map((pool) => {
              const totalCapacity = getTotalCapacity(pool.Capacity);
              const nestedPoolsCount = pool.Resources.filter((resource) => resource.NestedPool != null).length;
              const hasNestedPools = nestedPoolsCount > 0;
              const progressValue =
                totalCapacity === 0n
                  ? 100
                  : Number((BigInt(pool.Capacity?.utilizedCapacity ?? 0n) * 100n) / totalCapacity);

              return (
                <Tr key={pool.id} opacity={isLoading ? 0.5 : 1} pointerEvents={isLoading ? 'none' : 'all'}>
                  {isNestedShown && (
                    <Td>
                      <Button
                        data-cy={`pool-${pool.Name}-children`}
                        isDisabled={!hasNestedPools}
                        as={Link}
                        to={`/resource-manager/pools/nested/${pool.id}`}
                        rightIcon={<FeatherIcon icon="chevron-down" size={20} />}
                        size="xs"
                      >
                        {nestedPoolsCount}
                      </Button>
                    </Td>
                  )}
                  <Td>
                    <Text as="span" fontWeight={600}>
                      {pool.Name}
                    </Text>
                  </Td>
                  <Td>
                    {pool.Tags?.map((t: Omit<TagType, 'Pools'>) => (
                      <Tag
                        data-cy={`pool-${pool.Name}-${t.Tag}`}
                        key={t.id}
                        marginRight={1}
                        onClick={() => {
                          if (t && onTagClick) {
                            onTagClick(t.Tag);
                          }
                        }}
                      >
                        {t.Tag}
                      </Tag>
                    ))}
                  </Td>
                  <Td>{pool.PoolType}</Td>
                  <Td>{pool.DealocationSafetyPeriod}</Td>
                  <Td>
                    <Text
                      as="span"
                      fontFamily="monospace"
                      color="red"
                      cursor="pointer"
                      onClick={() => onStrategyClick?.(pool.ResourceType?.id)}
                    >
                      {pool.ResourceType?.Name}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    <Progress size="xs" value={progressValue} />
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        data-cy={`config-pool-${pool.Name}`}
                        aria-label="config"
                        size="xs"
                        variant="outline"
                        icon={<Icon as={FeatherIcon} size={20} icon="settings" />}
                        as={Link}
                        to={`../pools/${pool.id}`}
                      />
                      <DeletePoolPopover
                        onDelete={() => onDeleteBtnClick(pool.id)}
                        canDeletePool={pool.Resources.length === 0}
                        entityName={pool.Name}
                        type="resource pool"
                      >
                        <IconButton
                          data-cy={`delete-pool-${pool.Name}`}
                          variant="outline"
                          size="xs"
                          colorScheme="red"
                          aria-label="delete"
                          icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                          isDisabled={pool.Resources && pool.Resources.length > 0}
                        />
                      </DeletePoolPopover>
                    </HStack>
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr textAlign="center">
              <Td>
                <HStack>
                  <Text>There are no resource pools</Text>
                  <Button colorScheme="blue" size="xs" as={Link} to="/resource-manager/pools/new">
                    Create pool
                  </Button>
                </HStack>
              </Td>
            </Tr>
          )}
        </Tbody>
      )}
    </Table>
  );
};

export default PoolsTable;
