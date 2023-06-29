import React from 'react';
import { Spinner, Td, Tr, Text } from '@chakra-ui/react';
import { ExecutedWorkflowStatus, WorkflowInstanceDetailQuery } from '../../../../__generated__/graphql';
import { ExecutedWorkflowItem } from '../executed-workflow-item';

type Props = {
  workflowInstanceDetail?: WorkflowInstanceDetailQuery['workflowInstanceDetail'];
  isLoadingSubWorkflows: boolean;
  onSubworkflowStatusClick?: (status: ExecutedWorkflowStatus | 'UNKNOWN') => void;
};

function ExecutedSubWorkflowTable({ workflowInstanceDetail, isLoadingSubWorkflows, onSubworkflowStatusClick }: Props) {
  const subworkflows = workflowInstanceDetail?.subworkflows;

  if (isLoadingSubWorkflows) {
    return (
      <Tr>
        <Td>
          <Spinner />
        </Td>
      </Tr>
    );
  }

  if (subworkflows == null) {
    return (
      <Tr>
        <Td>No subworkflows found for this workflow</Td>
      </Tr>
    );
  }

  if (subworkflows.length === 0) {
    return (
      <Tr>
        <Td />
        <Td colSpan={4}>
          <Text paddingLeft={8} textStyle="italic" color="gray.400">
            This executed workflow has no subworkflows
          </Text>
        </Td>
      </Tr>
    );
  }

  return (
    <>
      {subworkflows.map((subworkflow) => {
        return (
          <ExecutedWorkflowItem
            key={subworkflow.executedWorkflowDetail.id}
            subworkflow={subworkflow}
            onSubworkflowStatusClick={onSubworkflowStatusClick}
          />
        );
      })}
    </>
  );
}

export default ExecutedSubWorkflowTable;
