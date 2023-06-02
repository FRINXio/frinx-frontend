import moment from 'moment';
import React, { FC, Fragment, useMemo, useState } from 'react';
import { Tr, Td, Checkbox, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { gql, useQuery } from 'urql';
import ExecutedWorkflowStatusLabels from '../executed-workflow-status-labels';
import {
  ExecutedWorkflowStatus,
  ExecutedWorkflowsQuery,
  WorkflowInstanceDetailQuery,
  WorkflowInstanceDetailQueryVariables,
} from '../../../../../__generated__/graphql';
import { SortProperty } from '../../executed-workflow-list';
import { sortExecutedWorkflows } from '../../executed-workflow.helpers';
import ExecutedSubWorkflowTable from './executed-subworkflow-table';

const WORKFLOW_INSTANCE_DETAIL_QUERY = gql`
  query WorkflowInstanceDetail($workflowId: String!) {
    workflowInstanceDetail(workflowId: $workflowId) {
      subworkflows {
        executedWorkflowDetail {
          id
          endTime
          startTime
          reasonForIncompletion
          status
          workflowId
          workflowName
          workflowVersion
        }
      }
    }
  }
`;

type Props = {
  workflows: NonNullable<ExecutedWorkflowsQuery['executedWorkflows']>;
  selectedWorkflows: string[];
  sort: SortProperty;
  onWorkflowSelect: (workflowId: string) => void;
  onWorkflowStatusClick?: (status: ExecutedWorkflowStatus | 'UNKNOWN') => void;
};

const ExecutedWorkflowHierarchicalTableItem: FC<Props> = ({
  workflows,
  sort,
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
      {sortExecutedWorkflows(workflows.edges, sort).map(({ node: item }) => (
        <Fragment key={item.workflowId}>
          <Tr>
            <Td>
              <Checkbox isChecked={selectedWorkflows.includes(item.id)} onChange={() => onWorkflowSelect(item.id)} />
            </Td>
            <Td
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={item.workflowId ?? 'Unknown workflow'}
              textColor="blue.500"
              cursor="pointer"
              onClick={() => handleOnShowSubWorkflows(item.id)}
            >
              {item.id === workflowInstanceDetailId ? (
                <Icon as={FeatherIcon} icon="chevron-up" size={20} w="6" h="6" paddingRight={2} />
              ) : (
                <Icon as={FeatherIcon} icon="chevron-down" size={20} w="6" h="6" paddingRight={2} />
              )}
              <Link to={`../executed/${item.workflowId}`}>{item.workflowId ?? '-'}</Link>
            </Td>

            <Td>{item.workflowName}</Td>

            <Td>{moment(item.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
            <Td>{item.endTime ? moment(item.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
            <Td>
              <ExecutedWorkflowStatusLabels status={item.status ?? 'UNKNOWN'} onClick={onWorkflowStatusClick} />
            </Td>
          </Tr>

          {hasProblemToLoadSubworkflows && (
            <Tr backgroundColor="gray.50">
              <Td>We had a problem to load subworkflows of selected workflow</Td>
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
