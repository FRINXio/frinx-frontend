import React, { VoidFunctionComponent } from 'react';
import { Icon, IconButton, Table, Tbody, Td, Th, Thead, Tr, Text, ButtonGroup } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { QueryAllocationStrategiesQuery } from '../../__generated__/graphql';
import DeleteModal from '../../components/delete-modal';

type Props = {
  strategies: QueryAllocationStrategiesQuery['QueryAllocationStrategies'];
  onScriptBtnClick: (lang: string, script: string, name: string) => void;
  onDeleteBtnClick: (id: string) => void;
};

const StrategiesTable: VoidFunctionComponent<Props> = ({ strategies, onScriptBtnClick, onDeleteBtnClick }) => {
  return (
    <Table background="white" size="sm">
      <Thead bgColor="gray.200">
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
              <ButtonGroup variant="outline" spacing={2} size="xs">
                <IconButton
                  data-cy={`strategy-${strategy.Name}-code`}
                  colorScheme="blue"
                  aria-label="code"
                  icon={<Icon size={20} as={FeatherIcon} icon="code" color="blue" />}
                  onClick={() => {
                    onScriptBtnClick(strategy.Lang, strategy.Script, strategy.Name);
                  }}
                />
                <DeleteModal type="strategy" onDelete={() => onDeleteBtnClick(strategy.id)} entityName={strategy.Name}>
                  <IconButton
                    data-cy={`strategy-${strategy.Name}-delete`}
                    colorScheme="red"
                    aria-label="delete"
                    icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                  />
                </DeleteModal>
              </ButtonGroup>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default StrategiesTable;
