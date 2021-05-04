// @flow
import React from 'react';
import { Button, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import moment from 'moment';

type Task = {
  taskType: string,
  seq: number,
  referenceTaskName: string,
  subWorkflowId: string,
  startTime: number,
  endTime: number,
  status: string,
};
type Props = {
  tasks: Task[],
  onTaskClick: (Task) => void,
  onWorkflowIdClick: (string) => void,
};

function formatDate(date?: string | number): string {
  if (!date) {
    return '-';
  }
  return moment(date).format('MM/DD/YYYY, HH:mm:ss:SSS');
}

const TaskTable = ({ tasks, onTaskClick, onWorkflowIdClick }: Props) => {
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
                    onWorkflowIdClick(task.subWorkflowId);
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
