import { Table, Thead, Tr, Th, Tbody, Td, VStack, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  altIds: Record<string, string | string[]>;
  altIdKeys: string[];
};

const isArray = (value: string | string[]): value is string[] => Array.isArray(value);

const AlternativeIdModalTable: VoidFunctionComponent<Props> = ({ altIdKeys, altIds }) => {
  return (
    <Table size="sm">
      <Thead bgColor="gray.200">
        <Tr>
          <Th>Key</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {altIdKeys.map((altId) => {
          let badgeItem;
          const alternativeIds = altIds[altId];

          if (isArray(alternativeIds)) {
            badgeItem = alternativeIds.map((id) => (
              <Text bgColor="gray.100" fontWeight="semibold" py={0.5} px={1} borderRadius="sm" key={id} fontSize="xs">
                {id}
              </Text>
            ));
          } else {
            badgeItem = (
              <Text fontSize="xs" bgColor="gray.100" fontWeight="semibold" py={0.5} px={1} borderRadius="sm">
                {alternativeIds}
              </Text>
            );
          }

          return (
            <Tr key={altId}>
              <Td>
                <Text as="i">{altId}:</Text>
              </Td>
              <Td>
                <VStack alignItems="start">{badgeItem}</VStack>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default AlternativeIdModalTable;
