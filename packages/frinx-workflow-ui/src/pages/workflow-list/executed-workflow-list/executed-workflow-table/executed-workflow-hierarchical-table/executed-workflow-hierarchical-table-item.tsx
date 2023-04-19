import moment from 'moment';
import React, { FC, Fragment, useMemo, useState } from 'react';
import { Tr, Td, Checkbox, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { gql, useQuery } from 'urql';
import ExecutedWorkflowStatusLabels from '../executed-workflow-status-labels';
import {
  ExecutedWorkflowsQuery,
  WorkflowInstanceDetailQuery,
  WorkflowInstanceDetailQueryVariables,
} from '../../../../../__generated__/graphql';

const WORKFLOW_INSTANCE_DETAIL_QUERY = gql`
  query WorkflowInstanceDetail($workflowInstanceDetailId: String!) {
    workflowInstanceDetail(id: $workflowInstanceDetailId) {
      subworkflows {
        workflowDetail {
          id
          name
        }
      }
    }
  }
`;

type Props = {
  workflows: NonNullable<ExecutedWorkflowsQuery['executedWorkflows']>;
  selectedWorkflows: string[];
  onWorkflowSelect: (workflowId: string) => void;
};

const ExecutedWorkflowHierarchicalTableItem: FC<Props> = ({ workflows, onWorkflowSelect, selectedWorkflows }) => {
  const workflowInstanceDetailCtx = useMemo(() => ({ additionalTypenames: ['WorkflowInstanceDetail'] }), []);
  const [workflowInstanceDetailId, setWorkflowInstanceDetailId] = useState('');

  const [{ error: workflowInstanceDetailError }] = useQuery<
    WorkflowInstanceDetailQuery,
    WorkflowInstanceDetailQueryVariables
  >({
    query: WORKFLOW_INSTANCE_DETAIL_QUERY,
    variables: {
      workflowInstanceDetailId,
    },
    context: workflowInstanceDetailCtx,
  });

  return (
    <>
      {workflows.edges.map(({ node: item }) => (
        <Fragment key={item.workflowId}>
          <Tr onClick={() => setWorkflowInstanceDetailId(item.id)}>
            <Td>
              <Checkbox
                isChecked={selectedWorkflows.includes(item.id)}
                onChange={() => {
                  onWorkflowSelect(item.id);
                }}
              />
            </Td>
            <Td
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={item.workflowId ?? 'Unknown workflow'}
              textColor="blue.500"
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
              <ExecutedWorkflowStatusLabels status={item.status ?? 'UNKNOWN'} />
            </Td>
          </Tr>

          {workflowInstanceDetailId.length > 0 && workflowInstanceDetailError != null && (
            <Tr>We had a problem to load subworkflows of selected workflow</Tr>
          )}

          {/* TODO: implement new SubWorkflow view when workflowInstanceDetail Query is finished - not implementing in current PR because of its size */}
          {/* {workflowInstanceDetailError == null && item.id === workflowInstanceDetailId && <ExecutedSubWorkflowTable subWorkflows={workflowInstanceDetail?.workflowInstanceDetail} isLoadingSubWorkflows={isLoadingWorkflowInstanceDetail}  workflowId={item.workflowId ?? ''} />} */}
        </Fragment>
      ))}
    </>
  );
};

export default ExecutedWorkflowHierarchicalTableItem;
