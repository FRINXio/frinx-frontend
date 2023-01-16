import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tag,
  HStack,
  Progress,
  Link as ChakraLink,
  Text,
  Icon,
  IconButton,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

type Aggregate = {
  id: string;
  aggregate: string;
  prefixes: number;
  freeCapacity: string | undefined;
  utilizedCapacity: string | undefined;
  tags: {
    tag: string;
    id: string;
  }[];
};

type Props = {
  aggregates: Aggregate[];
  onTagClick: (tag: string) => void;
  onDeletePoolClick: (id: string) => void;
};

const AggregatesTable: VoidFunctionComponent<Props> = ({ aggregates, onTagClick, onDeletePoolClick }) => {
  return (
    <TableContainer background="white">
      <Table size="sm">
        <Thead>
          <Tr bgColor="gray.200">
            <Th>Aggregate</Th>
            <Th>Prefixes</Th>
            <Th>Tags</Th>
            <Th>Capacity utilization</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {aggregates == null || aggregates.length === 0 ? (
            <Tr>
              <Td>
                There are no aggregates to be shown yet{' '}
                <Button
                  data-cy="create-aggregate"
                  variant="solid"
                  colorScheme="blue"
                  as={Link}
                  to="/resource-manager/pools/new?resource-type-name=ipv4_prefix"
                  size="xs"
                  ml={5}
                >
                  Create aggregate
                </Button>
              </Td>
            </Tr>
          ) : (
            aggregates.map(({ id, aggregate, prefixes, tags, ...rest }) => {
              const freeCapacity = Number(rest.freeCapacity);
              const utilizedCapacity = Number(rest.utilizedCapacity);
              const totalCapacity = BigInt(freeCapacity) + BigInt(utilizedCapacity);
              const capacityUtilization =
                utilizedCapacity && freeCapacity
                  ? Math.floor(Number((BigInt(utilizedCapacity) * 100n) / totalCapacity))
                  : 0;

              return (
                <Tr key={id}>
                  <Td>{aggregate}</Td>
                  {prefixes > 0 ? (
                    <Td>
                      <ChakraLink as={Link} to={`/resource-manager/pools/nested/${id}`} color="blue">
                        {prefixes}
                      </ChakraLink>
                    </Td>
                  ) : (
                    <Td>{prefixes}</Td>
                  )}
                  <Td>
                    {tags.map(({ tag, id: tagId }) => (
                      <Tag
                        data-cy={`${aggregate}-${tag}-tag`}
                        key={tagId}
                        ml={1}
                        onClick={() => onTagClick(tag)}
                        cursor="pointer"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Td>
                  <Td>
                    <HStack>
                      <Text>{capacityUtilization}%</Text>
                      <Progress width="90%" value={capacityUtilization} />
                    </HStack>
                  </Td>
                  <Td>
                    <ButtonGroup size="xs">
                      <IconButton
                        data-cy={`aggregate-${aggregate}-config`}
                        aria-label="config"
                        size="xs"
                        variant="outline"
                        icon={<Icon as={FeatherIcon} size={20} icon="settings" />}
                        as={Link}
                        to={`../pools/${id}`}
                      />
                      <IconButton
                        data-cy={`aggregate-${aggregate}-delete`}
                        variant="outline"
                        size="xs"
                        colorScheme="red"
                        aria-label="delete"
                        icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                        isDisabled={BigInt(freeCapacity ?? 0) !== BigInt(totalCapacity)}
                        title={
                          BigInt(freeCapacity ?? 0n) !== BigInt(totalCapacity)
                            ? 'Cannot delete pool until you delete all allocated resources'
                            : ''
                        }
                        onClick={() => {
                          onDeletePoolClick(id);
                        }}
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default AggregatesTable;
