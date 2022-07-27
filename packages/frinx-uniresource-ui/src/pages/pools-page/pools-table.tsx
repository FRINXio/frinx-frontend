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
import { GetPoolsQuery, PoolCapacityPayload, Tag as TagType } from '../../__generated__/graphql';

type Props = {
  pools: GetPoolsQuery['QueryRootResourcePools'];
  isLoading: boolean;
  isNestedShown?: boolean;
  onDeleteBtnClick: (id: string) => void;
  onTagClick?: (tag: string) => void;
};

function getTotalCapacity(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  return Number(capacity.freeCapacity) + Number(capacity.utilizedCapacity);
}
function getCapacityValue(capacity: PoolCapacityPayload | null): number {
  if (capacity == null) {
    return 0;
  }
  const totalCapacity = getTotalCapacity(capacity);
  if (totalCapacity === 0) {
    return 0;
  }
  return (Number(capacity.utilizedCapacity) / totalCapacity) * 100;
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
              const capacityValue = getCapacityValue(pool.Capacity);
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
                    <Progress size="xs" value={capacityValue} />
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
                      <IconButton
                        variant="outline"
                        size="xs"
                        colorScheme="red"
                        aria-label="delete"
                        icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                        onClick={() => {
                          onDeleteBtnClick(pool.id);
                        }}
                        isDisabled={Number(pool.Capacity?.freeCapacity) !== totalCapacity}
                      />
                    </HStack>
                  </Td>
                </Tr>
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
