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
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';

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
};

const AggregatesTable: VoidFunctionComponent<Props> = ({ aggregates, onTagClick }) => {
  return (
    <TableContainer background="white">
      <Table size="sm">
        <Thead>
          <Tr bgColor="gray.200">
            <Th>Aggregate</Th>
            <Th>Prefixes</Th>
            <Th>Tags</Th>
            <Th>Capacity utilization</Th>
          </Tr>
        </Thead>
        <Tbody>
          {aggregates == null || aggregates.length === 0 ? (
            <Tr>
              <Td>Currently there are no aggregates created yet</Td>
            </Tr>
          ) : (
            aggregates.map(({ id, aggregate, freeCapacity, prefixes, utilizedCapacity, tags }) => {
              const capacityUtilization =
                utilizedCapacity && freeCapacity
                  ? Math.floor(
                      Number(
                        (BigInt(utilizedCapacity) / (BigInt(freeCapacity) + BigInt(utilizedCapacity))) * BigInt(100),
                      ),
                    )
                  : 0;

              return (
                <Tr key={id}>
                  <Td>{aggregate}</Td>
                  {prefixes > 0 ? (
                    <Td>
                      <ChakraLink as={Link} to={`/uniresource/pools/nested/${id}`} color="blue">
                        {prefixes}
                      </ChakraLink>
                    </Td>
                  ) : (
                    <Td>{prefixes}</Td>
                  )}
                  <Td>
                    {tags.map(({ tag, id: tagId }) => (
                      <Tag key={tagId} ml={1} onClick={() => onTagClick(tag)} cursor="pointer">
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
