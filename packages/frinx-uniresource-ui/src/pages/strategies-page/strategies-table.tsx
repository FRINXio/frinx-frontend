import React, { VoidFunctionComponent } from 'react';
import { HStack, Icon, IconButton, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { QueryAllocationStrategiesQuery } from '../../__generated__/graphql';

type Props = {
  strategies: QueryAllocationStrategiesQuery['QueryAllocationStrategies'];
  onScriptBtnClick: (lang: string, script: string) => void;
  onDeleteBtnClick: (id: string) => void;
};

const StrategiesTable: VoidFunctionComponent<Props> = ({ strategies, onScriptBtnClick, onDeleteBtnClick }) => {
  return (
    <Table background="white">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Language</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {strategies.map((strategy) => (
          <Tr key={strategy.id}>
            <Td>
              <Text as="span" fontWeight={600}>
                {strategy.Name}
              </Text>
            </Td>
            <Td>
              <Text as="span" fontFamily="monospace" color="red">
                {strategy.Lang}
              </Text>
            </Td>
            <Td>
              <HStack spacing={2}>
                <IconButton
                  variant="outline"
                  colorScheme="blue"
                  ml={2}
                  aria-label="delete"
                  icon={<Icon size={20} as={FeatherIcon} icon="code" color="blue" />}
                  onClick={() => {
                    onScriptBtnClick(strategy.Lang, strategy.Script);
                  }}
                />
                <IconButton
                  variant="outline"
                  colorScheme="red"
                  aria-label="delete"
                  icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                  onClick={() => {
                    onDeleteBtnClick(strategy.id);
                  }}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default StrategiesTable;
