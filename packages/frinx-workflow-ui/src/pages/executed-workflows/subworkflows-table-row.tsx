import { Td, Tr, Link as ChakraLink, Text, Progress } from '@chakra-ui/react';
import moment from 'moment';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import WorkflowStatusLabel from '../../components/workflow-status-label/workflow-status-label';
import {
  Subworkflow,
  // WorkflowInstanceDetailQuery,
  // WorkflowInstanceDetailQueryVariables,
} from '../../__generated__/graphql';

const WORKFLOW_INSTANCE_DETAIL_QUERY = gql`
  query WorkflowInstanceDetail($workflowId: String!) {
    conductor {
      workflowInstanceDetail(workflowId: $workflowId) {
        subworkflows {
          referenceTaskName
          workflowDetail {
            id
            name
          }
          executedWorkflowDetail {
            id
            startTime
            endTime
            createdAt
            originalId
            status
          }
        }
      }
    }
  }
`;

type Props = {
  workflowId: string;
};

const SubworkflowTableRow: FC<Props> = ({ workflowId }) => {
  const [{ data, fetching }] = useQuery<unknown>({
    query: WORKFLOW_INSTANCE_DETAIL_QUERY,
    variables: { workflowId },
  });
  // const subworkflows = data?.conductor.workflowInstanceDetail.subworkflows;
  const subworkflows: Subworkflow[] = [];

  if (fetching) {
    return (
      <Tr>
        <Td colSpan={5}>
          <Progress isIndeterminate />
        </Td>
      </Tr>
    );
  }

  if (subworkflows == null) {
    return (
      <Tr>
        <Td colSpan={5} textAlign="center">
          No subworkflows found for this workflow
        </Td>
      </Tr>
    );
  }

  if (subworkflows.length === 0) {
    return (
      <Tr>
        <Td colSpan={5}>
          <Text paddingLeft={8} textStyle="italic" color="gray.400">
            This executed workflow has no subworkflows
          </Text>
        </Td>
      </Tr>
    );
  }

  return (
    <>
      {subworkflows.map((w) => {
        const { executedWorkflowDetail, workflowDetail } = w;
        return (
          <Tr key={w.referenceTaskName} background="gray.50">
            <Td />
            <Td>
              <ChakraLink color="blue.500" as={Link} to={executedWorkflowDetail?.id} display="block" marginBottom={2}>
                {workflowDetail?.name}
              </ChakraLink>
              <Text as="span" color="blackAlpha.700" fontSize="sm">
                {executedWorkflowDetail?.originalId}
              </Text>
            </Td>
            <Td>
              {executedWorkflowDetail?.startTime != null
                ? moment(executedWorkflowDetail.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')
                : '-'}
            </Td>
            <Td>
              {executedWorkflowDetail?.endTime != null
                ? moment(executedWorkflowDetail.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS')
                : '-'}
            </Td>
            <Td>
              <WorkflowStatusLabel status={executedWorkflowDetail?.status ?? 'UNKNOWN'} />
            </Td>
          </Tr>
        );
      })}
    </>
  );
};

export default SubworkflowTableRow;
