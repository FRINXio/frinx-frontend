import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Tfoot, Icon, IconButton, Stack, Td } from '@chakra-ui/react';
import { faFileCode, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paginator from '../../../common/pagination';
import { TaskDefinition } from '../../../types/uniflow-types';

type Pagination = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

type TaskTableProps = {
  pagination: Pagination;
  tasks: Array<TaskDefinition>;
  sortArray: (fieldName: string) => void;
  onTaskDelete: (taskName: string) => void;
  onTaskConfigClick: (taskName: string) => void;
};

export default function TaskTable({
  sortArray,
  pagination: { currentPage, setCurrentPage, totalPages },
  tasks,
  onTaskConfigClick,
  onTaskDelete,
}: TaskTableProps) {
  return (
    <Table background="white">
      <Thead>
        <Tr>
          <Th onClick={() => sortArray('name')} cursor="pointer">
            Name/Version
          </Th>
          <Th onClick={() => sortArray('timeoutPolicy')} cursor="pointer">
            Timeout Policy
          </Th>
          <Th onClick={() => sortArray('timeoutSeconds')} cursor="pointer">
            Timeout Seconds
          </Th>
          <Th onClick={() => sortArray('responseTimeoutSeconds')} cursor="pointer">
            Response Timeout
          </Th>
          <Th onClick={() => sortArray('retryCount')} cursor="pointer">
            Retry Count
          </Th>
          <Th onClick={() => sortArray('retryLogic')} cursor="pointer">
            Retry Logic
          </Th>
          <Th textAlign="center">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tasks.map((task) => (
          <Tr key={task.name}>
            <Td>{task.name}</Td>
            <Td>{task.timeoutPolicy}</Td>
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
                  icon={<Icon as={FontAwesomeIcon} icon={faFileCode} />}
                  onClick={() => onTaskConfigClick(task.name)}
                />
                <IconButton
                  aria-label="Delete task"
                  colorScheme="red"
                  isRound
                  variant="outline"
                  onClick={() => onTaskDelete(task.name)}
                  title="Delete"
                  icon={<Icon as={FontAwesomeIcon} icon={faTrash} />}
                />
              </Stack>
            </Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>
            <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} />
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
}
