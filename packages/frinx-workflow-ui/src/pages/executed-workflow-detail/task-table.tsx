import React, { FC } from 'react';
import { Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { WorkflowStatus } from '@frinx/shared';
import { formatDate } from '../../helpers/utils.helpers';
import WorkflowStatusLabel from '../../components/workflow-status-label/workflow-status-label';

type ExecutedWorkflowTask = {
  id: string;
  taskType: string | null;
  referenceTaskName: string | null;
  startTime: string | null;
  endTime: string | null;
  status: string | null;
  subWorkflowId: string | null;
};

type Props = {
  tasks?: ExecutedWorkflowTask[] | null;
  onTaskClick: (id: string) => void;
};

const TaskTable: FC<Props> = ({ tasks, onTaskClick }) => {
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
            <Tr key={task.referenceTaskName}>
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
              <Td>
                <WorkflowStatusLabel status={(task.status as WorkflowStatus) ?? 'UNKNOWN'} />
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default TaskTable;
