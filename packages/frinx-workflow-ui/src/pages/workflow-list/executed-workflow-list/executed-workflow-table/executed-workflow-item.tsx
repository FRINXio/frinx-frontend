import React from 'react';
import moment from 'moment';
import { Text, Tr, Td } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ExecutedWorkflowTask } from '@frinx/workflow-ui/src/helpers/types';

type ExecutedSubworkflowTask = ExecutedWorkflowTask & { inputData: Record<string, string> };
type Props = {
  workflow: ExecutedSubworkflowTask;
};

export const ExecutedWorkflowItem = ({ workflow }: Props) => {
  return (
    <Tr key={workflow.subWorkflowId}>
      <Td />
      <Td
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={workflow.taskType}
      >
        <Text paddingLeft={8}>
          <Link to={`../executed/${workflow.subWorkflowId}`}>{workflow.inputData.subWorkflowName}</Link>
        </Text>
      </Td>
      <Td>{workflow.status}</Td>
      <Td>{moment(workflow.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
      <Td>{workflow.endTime ? moment(workflow.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
    </Tr>
  );
};
