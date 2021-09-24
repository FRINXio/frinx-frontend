// @flow
import React, { FC } from 'react';
import { Button, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { Task } from '../../../../types/task';

type Props = {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onWorkflowClick: (wfId: string) => void;
  formatDate: (date: number | string) => string;
};

const TaskTable: FC<Props> = ({ tasks, onTaskClick, onWorkflowClick, formatDate }) => {
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
        {tasks.map((task) => (
          <Tr key={task.referenceTaskName}>
            <Td>{task.seq}</Td>
            <Td
              onClick={() => {
                onTaskClick(task);
              }}
              cursor="pointer"
            >
              <Tooltip label={task.taskType}>
                <Text isTruncated maxWidth={32}>
                  {task.taskType}
                </Text>
              </Tooltip>
            </Td>
            <Td textAlign="center">
              {task.taskType === 'SUB_WORKFLOW' ? (
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onWorkflowClick(task.subWorkflowId);
                  }}
                >
                  <i className="fas fa-arrow-circle-right" />
                </Button>
              ) : null}
            </Td>
            <Td
              onClick={() => {
                onTaskClick(task);
              }}
              cursor="pointer"
            >
              <Tooltip label={task.referenceTaskName}>
                <Text isTruncated maxWidth={32}>
                  {task.referenceTaskName}
                </Text>
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
