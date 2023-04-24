// TODO: unfinished SubWorkflow component when workflowInstanceDetail Query is finished - not implementing in current PR because of its size

import React from 'react';
import { Spinner, Td, Tr, Text } from '@chakra-ui/react';
import { WorkflowInstanceDetailQuery } from '../../../../../__generated__/graphql';

type Props = {
  workflowInstanceDetail: WorkflowInstanceDetailQuery['workflowInstanceDetail'];
  isLoadingSubWorkflows: boolean;
};

function ExecutedSubWorkflowTable({ workflowInstanceDetail, isLoadingSubWorkflows }: Props) {
  const subWorkflows = workflowInstanceDetail?.subworkflows;

  if (subWorkflows == null || subWorkflows.length === 0) {
    return (
      <Tr>
        <Td>No subworkflows found for this workflow</Td>
      </Tr>
    );
  }
  if (isLoadingSubWorkflows) {
    return (
      <Tr>
        <Td>
          <Spinner />
        </Td>
      </Tr>
    );
  }

  if (subWorkflows.length === 0) {
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

  // eslint-disable-next-line no-lone-blocks
  {
    /* <ExecutedWorkflowItem key={workflowDetail.} workflow={w}/> */
  }
  return (
    <>
      {subWorkflows.map(() => (
        <Tr>
          <Td>Some subworkflow</Td>
        </Tr>
      ))}
    </>
  );
}

export default ExecutedSubWorkflowTable;
