import React from 'react';
import { Spinner, Td, Tr, Text } from '@chakra-ui/react';
import { ExecutedWorkflowTask } from '@frinx/workflow-ui/src/helpers/types';
import { ExecutedWorkflowItem } from '../executed-workflow-item';

type ExecutedSubworkflowTask = ExecutedWorkflowTask & { inputData: Record<string, string> };
type ExecutedSubWorkflows = {
  isLoading: boolean;
  subWorkflows: ExecutedSubworkflowTask[];
};
type Props = {
  workflowId: string;
  subWorkflows: Map<string, ExecutedSubWorkflows>;
};
function ExecutedSubWorkflowTable({ workflowId, subWorkflows }: Props) {
  const workflows = subWorkflows.get(workflowId);

  if (workflows == null) {
    return null;
  }

  if (workflows.isLoading) {
    return (
      <Tr>
        <Td>
          <Spinner />
        </Td>
      </Tr>
    );
  }

  if (workflows.subWorkflows.length === 0) {
    return (
      <Tr>
        <Td />
        <Td colSpan={4}>
          <Text paddingLeft={8} textStyle="italic" color="gray.400">
            No subworkflows
          </Text>
        </Td>
      </Tr>
    );
  }

  return (
    <>
      {workflows.subWorkflows.map((w) => (
        <ExecutedWorkflowItem key={w.subWorkflowId} workflow={w} />
      ))}
    </>
  );
}

export default ExecutedSubWorkflowTable;
