import React, { FC } from 'react';
import { Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { ControlExecutedWorkflowSubscription } from '../../__generated__/graphql';

type Props = {
  executedWorkflow: NonNullable<ControlExecutedWorkflowSubscription['controlExecutedWorkflow']>;
  onTaskClick: (id: string) => void;
  formatDate: (date: Date | number | undefined | null | string) => string;
};

const TaskTable: FC<Props> = ({ executedWorkflow, onTaskClick, formatDate }) => {
  const { tasks } = executedWorkflow;

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>#</Th>
          <Th>Task Type</Th>
          <Th width={2.5}>Subwf.</Th>
          <Th>Task Ref. Name</Th>
          <Th>Start/End Time</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tasks == null && (
          <Tr>
            <Td colSpan={6}>No tasks found</Td>
          </Tr>
        )}
        {tasks != null &&
          tasks.map((task, index) => (
            <Tr key={task.id}>
              <Td>{index}</Td>
              <Td
                onClick={() => {
                  onTaskClick(task.id);
                }}
                cursor="pointer"
              >
                <Tooltip label={task.taskType}>
                  <Text>{task.taskType}</Text>
                </Tooltip>
              </Td>
              <Td textAlign="center">
                {task.taskType === 'SUB_WORKFLOW' ? (
                  <IconButton
                    colorScheme="blue"
                    size="sm"
                    aria-label="show-subworkflow"
                    as={Link}
                    to={`../executed/${task.subWorkflowId}`}
                    icon={<Icon size={12} as={FeatherIcon} icon="arrow-right" />}
                    isDisabled={task.subWorkflowId == null}
                  />
                ) : null}
              </Td>
              <Td
                onClick={() => {
                  onTaskClick(task.id);
                }}
                cursor="pointer"
              >
                <Tooltip label={task.referenceTaskName}>
                  <Text>{task.referenceTaskName}</Text>
                </Tooltip>
              </Td>
              <Td>
                {formatDate(task.startTime)}
                <br />
                {formatDate(task.endTime)}
              </Td>
              <Td>{task.status}</Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default TaskTable;
