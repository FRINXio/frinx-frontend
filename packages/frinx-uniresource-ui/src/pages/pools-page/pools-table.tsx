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
import DeletePoolPopover from '../../components/delete-pool-modal';
import { GetPoolsQuery, PoolCapacityPayload, Tag as TagType } from '../../__generated__/graphql';

type Props = {
  pools: GetPoolsQuery['QueryRootResourcePools'];
  isLoading: boolean;
  isNestedShown?: boolean;
  onDeleteBtnClick: (id: string) => void;
  onTagClick?: (tag: string) => void;
};

function getTotalCapacity(capacity: PoolCapacityPayload | null): bigint {
  if (capacity == null) {
    return 0n;
  }
  return BigInt(capacity.freeCapacity) + BigInt(capacity.utilizedCapacity);
}

const PoolsTable: VoidFunctionComponent<Props> = ({
  pools,
  onDeleteBtnClick,
  isLoading,
  isNestedShown = true,
  onTagClick,
}) => {
  return (
    <Table background="white" size="sm">
      <Thead bgColor="gray.200">
        <Tr>
          {isNestedShown && <Th>Children</Th>}
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
          {pools.length > 0 ? (
            pools.map((pool) => {
              const totalCapacity = getTotalCapacity(pool.Capacity);
              const nestedPoolsCount = pool.Resources.filter((resource) => resource.NestedPool != null).length;
              const hasNestedPools = nestedPoolsCount > 0;

              return (
                <Tr key={pool.id} opacity={isLoading ? 0.5 : 1} pointerEvents={isLoading ? 'none' : 'all'}>
                  {isNestedShown && (
                    <Td>
                      <Button
                        isDisabled={!hasNestedPools}
                        as={Link}
                        to={`/uniresource/pools/nested/${pool.id}`}
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
                        key={t.id}
                        marginRight={1}
                        cursor="pointer"
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
                  <Td>
                    <Text as="span" fontFamily="monospace" color="red">
                      {pool.ResourceType?.Name}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    <Progress
                      size="xs"
                      value={Number((BigInt(pool.Capacity?.utilizedCapacity ?? 0) * 100n) / totalCapacity)}
                    />
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
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
                        poolName={pool.Name}
                      >
                        <IconButton
                          variant="outline"
                          size="xs"
                          colorScheme="red"
                          aria-label="delete"
                          icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                          isDisabled={pool.Resources.length > 0}
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
                  <Button colorScheme="blue" size="xs" as={Link} to="/uniresource/pools/new">
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
