import React from 'react';
import moment from 'moment';
import { Text, Tr, Td } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ExecutedWorkflowStatus, WorkflowInstanceDetailQuery } from '../../../__generated__/graphql';
import ExecutedWorkflowStatusLabels from './executed-workflow-status-labels';

type Props = {
  subworkflow: NonNullable<NonNullable<WorkflowInstanceDetailQuery['workflowInstanceDetail']>['subworkflows']>[0];
  onSubworkflowStatusClick?: (status: ExecutedWorkflowStatus | 'UNKNOWN') => void;
};

export function ExecutedWorkflowItem({ subworkflow, onSubworkflowStatusClick }: Props) {
  const executedSubworkflow = subworkflow.executedWorkflowDetail;

  return (
    <Tr backgroundColor="gray.50">
      <Td />
      <Td>
        <Text paddingLeft={8} whiteSpace="nowrap">
          {executedSubworkflow.workflowId}
        </Text>
      </Td>
      <Td
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={`${executedSubworkflow.workflowName} ${executedSubworkflow.workflowVersion}`}
      >
        <Text paddingLeft={8}>
          <Link to={`../executed/${executedSubworkflow.id}`}>
            {executedSubworkflow.workflowName} / {executedSubworkflow.workflowVersion}
          </Link>
        </Text>
      </Td>
      <Td>
        {executedSubworkflow.startTime ? moment(executedSubworkflow.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}
      </Td>
      <Td>
        {executedSubworkflow.endTime ? moment(executedSubworkflow.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}
      </Td>
      <Td>
        <ExecutedWorkflowStatusLabels
          status={executedSubworkflow.status ?? 'UNKNOWN'}
          onClick={onSubworkflowStatusClick}
        />
      </Td>
    </Tr>
  );
}
