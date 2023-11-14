import moment from 'moment';
import React, { FC, Fragment, useMemo, useState } from 'react';
import { Tr, Td, Checkbox, Icon, Link as ChakraLink, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { gql, useQuery } from 'urql';
import ExecutedWorkflowStatusLabels from '../executed-workflow-status-labels';
import {
  WorkflowStatus,
  ExecutedWorkflowsQuery,
  WorkflowInstanceDetailQuery,
  WorkflowInstanceDetailQueryVariables,
} from '../../../../__generated__/graphql';
import ExecutedSubWorkflowTable from './executed-subworkflow-table';

// const WORKFLOW_INSTANCE_DETAIL_QUERY = gql`
//   query WorkflowInstanceDetail($workflowId: String!) {
//     workflowInstanceDetail(workflowId: $workflowId) {
//       subworkflows {
//         executedWorkflowDetail {
//           id
//           endTime
//           startTime
//           reasonForIncompletion
//           status
//           workflowId
//           workflowName
//           workflowVersion
//         }
//       }
//     }
//   }
// `;
//
type Props = {
  workflows: NonNullable<ExecutedWorkflowsQuery['conductor']['executedWorkflows']>;
  selectedWorkflows: string[];
  onWorkflowSelect: (workflowId: string) => void;
  onWorkflowStatusClick?: (status: WorkflowStatus | 'UNKNOWN') => void;
};

const ExecutedWorkflowHierarchicalTableItem: FC<Props> = ({
  workflows,
  selectedWorkflows,
  onWorkflowSelect,
  onWorkflowStatusClick,
}) => {
  const workflowInstanceDetailCtx = useMemo(() => ({ additionalTypenames: ['WorkflowInstanceDetail'] }), []);
  const [workflowInstanceDetailId, setWorkflowInstanceDetailId] = useState<string | null>(null);

  const [{ data, fetching, error: workflowInstanceDetailError }] = useQuery<
    WorkflowInstanceDetailQuery,
    WorkflowInstanceDetailQueryVariables
  >({
    query: WORKFLOW_INSTANCE_DETAIL_QUERY,
    variables: {
      workflowId: workflowInstanceDetailId ?? '',
    },
    context: workflowInstanceDetailCtx,
  });

  const handleOnShowSubWorkflows = (workflowId: string) => {
    if (workflowId !== workflowInstanceDetailId) {
      setWorkflowInstanceDetailId(workflowId);
    } else {
      setWorkflowInstanceDetailId(null);
    }
  };

  const hasProblemToLoadSubworkflows =
    workflowInstanceDetailId != null && workflowInstanceDetailError != null && !fetching;
  const canShowSubworkflows = (executedWorkflowId: string) => workflowInstanceDetailId === executedWorkflowId;

  return (
    <>
      {workflows.edges.map(({ node: item }) => (
        <Fragment key={item.id}>
          <Tr>
            <Td>
              <Checkbox
                isChecked={selectedWorkflows.includes(item.id)}
                onChange={() => {
                  onWorkflowSelect(item.id);
                }}
              />
            </Td>
            <Td display="flex" alignItems="center">
              <Button
                size="xs"
                colorScheme="blackAlpha"
                variant="ghost"
                onClick={() => {
                  handleOnShowSubWorkflows(item.id);
                }}
              >
                {item.id === workflowInstanceDetailId ? (
                  <Icon as={FeatherIcon} icon="chevron-up" size={20} w="6" h="6" />
                ) : (
                  <Icon as={FeatherIcon} icon="chevron-down" size={20} w="6" h="6" />
                )}
              </Button>
              <ChakraLink as={Link} to={item.id} color="blue.500">
                {item.workflowDefinition?.name}
              </ChakraLink>
            </Td>
            <Td>{moment(item.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
            <Td>{item.endTime ? moment(item.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
            <Td>
              <ExecutedWorkflowStatusLabels status={item.status ?? 'UNKNOWN'} onClick={onWorkflowStatusClick} />
            </Td>
          </Tr>

          {hasProblemToLoadSubworkflows && item.id === workflowInstanceDetailId && (
            <Tr backgroundColor="gray.50">
              <Td colSpan={5} textAlign="center">
                We had a problem to load subworkflows of selected workflow
              </Td>
            </Tr>
          )}

          {canShowSubworkflows(item.id) && (
            <ExecutedSubWorkflowTable
              workflowInstanceDetail={data?.workflowInstanceDetail}
              isLoadingSubWorkflows={fetching}
              onSubworkflowStatusClick={onWorkflowStatusClick}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};

export default ExecutedWorkflowHierarchicalTableItem;
