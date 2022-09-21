import React, { FC } from 'react';
import { Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { ExecutedWorkflowTask } from '@frinx/workflow-ui/src/helpers/types';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

type Props = {
  tasks: ExecutedWorkflowTask[];
  onTaskClick: (task: ExecutedWorkflowTask) => void;
  formatDate: (date: number | string) => string;
};

const TaskTable: FC<Props> = ({ tasks, onTaskClick, formatDate }) => (
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

export default TaskTable;
