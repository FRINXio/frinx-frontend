import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Icon, IconButton, Stack, Td } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { TaskDefinition } from '@frinx/shared';
import { TasksOrderByInput, SortTasksBy } from '../../../__generated__/graphql';

type TaskTableProps = {
  tasks: TaskDefinition[];
  orderBy: TasksOrderByInput | null;
  onSort: (fieldName: SortTasksBy) => void;
  onTaskDelete: (task: TaskDefinition) => void;
  onTaskConfigClick: (task: TaskDefinition) => void;
};

export default function TaskTable({ onSort, tasks, orderBy, onTaskConfigClick, onTaskDelete }: TaskTableProps) {
  return (
    <Table background="white">
      <Thead>
        <Tr>
          <Th onClick={() => onSort({ _fake: 'name' })} cursor="pointer">
            Name/Version
            {orderBy?.sortKey._fake === 'name' && (
              <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th>
          {/* <Th onClick={() => onSort({ _fake: 'timeoutPolicy' })} cursor="pointer">
            Timeout Policy
            {orderBy?.sortKey._fake === 'timeoutPolicy' && (
              <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th> */}
          <Th onClick={() => onSort({ _fake: 'timeoutSeconds' })} cursor="pointer">
            Timeout Seconds
            {orderBy?.sortKey._fake === 'timeoutSeconds' && (
              <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th>
          <Th onClick={() => onSort({ _fake: 'responseTimeoutSeconds' })} cursor="pointer">
            Response Timeout
            {orderBy?.sortKey._fake === 'responseTimeoutSeconds' && (
              <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th>
          <Th onClick={() => onSort({ _fake: 'retryCount' })} cursor="pointer">
            Retry Count
            {orderBy?.sortKey._fake === 'retryCount' && (
              <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th>
          <Th onClick={() => onSort({ _fake: 'retryLogic' })} cursor="pointer">
            Retry Logic
            {orderBy?.sortKey._fake === 'retryLogic' && (
              <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
            )}
          </Th>
          <Th textAlign="center">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tasks.map((task) => (
          <Tr key={task.name}>
            <Td>{task.name}</Td>
            {/* <Td>{task.timeoutPolicy?._fake}</Td> */}
            <Td>{task.timeoutSeconds}</Td>
            <Td>{task.responseTimeoutSeconds}</Td>
            <Td>{task.retryCount}</Td>
            <Td>{task.retryLogic}</Td>
            <Td textAlign="center">
              <Stack direction="row" spacing={1}>
                <IconButton
                  aria-label="Show task config"
                  colorScheme="gray"
                  isRound
                  variant="outline"
                  title="Definition"
                  icon={<Icon size={20} as={FeatherIcon} icon="code" />}
                  onClick={() => onTaskConfigClick(task)}
                />
                <IconButton
                  aria-label="Delete task"
                  colorScheme="red"
                  isRound
                  variant="outline"
                  onClick={() => onTaskDelete(task)}
                  title="Delete"
                  icon={<Icon size={20} as={FeatherIcon} icon="trash-2" />}
                />
              </Stack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
