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
import { GetAllPoolsQuery, PoolCapacityPayload } from '../../__generated__/graphql';

type Props = {
  pools?: GetAllPoolsQuery['QueryResourcePools'];
  isLoading: boolean;
  onDeleteBtnClick: (id: string) => void;
  isNestedShown?: boolean;
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

const PoolsTable: VoidFunctionComponent<Props> = ({ pools, onDeleteBtnClick, isLoading, isNestedShown = true }) => {
  return (
    <Table background="white">
      <Thead>
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
          {pools !== undefined && pools.length > 0 ? (
            pools.map((pool) => {
              const capacityValue = getCapacityValue(pool.Capacity);
              const totalCapacity = getTotalCapacity(pool.Capacity);
              const nestedPoolsCount = pool.Resources.filter((resource) => resource.NestedPool != null).length;
              const hasNestedPools = nestedPoolsCount > 0;

              return (
                <Tr key={pool.id}>
                  {isNestedShown && (
                    <Td>
                      <Button
                        isDisabled={!hasNestedPools}
                        as={Link}
                        to={`nested/${pool.id}`}
                        rightIcon={<FeatherIcon icon="chevron-down" size={20} />}
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
                        variant="outline"
                        icon={<Icon as={FeatherIcon} size={20} icon="settings" />}
                        as={Link}
                        to={`../pools/${pool.id}`}
                      />
                      <IconButton
                        variant="outline"
                        size="sm"
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
