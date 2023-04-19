import { Checkbox, Td, Tr } from '@chakra-ui/react';
import moment from 'moment';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ExecutedWorkflowsQuery } from '../../../../../__generated__/graphql';
import ExecutedWorkflowStatusLabels from '../executed-workflow-status-labels';
import { SortProperty } from '../../executed-workflow-list';
import { sortExecutedWorkflows } from '../../executed-workflow.helpers';

type Props = {
  workflows: ExecutedWorkflowsQuery;
  selectedWorkflows: string[];
  sort: SortProperty;
  onWorkflowSelect: (workflowId: string) => void;
};

const ExecutedWorkflowFlatTableItem: FC<Props> = ({ workflows, sort, onWorkflowSelect, selectedWorkflows }) => {
  if (workflows.executedWorkflows?.edges == null || workflows.executedWorkflows?.edges.length === 0) {
    return <Tr>No executed workflows available</Tr>;
  }

  return (
    <>
      {sortExecutedWorkflows(workflows.executedWorkflows.edges, sort).map(({ node }) => (
        <Tr key={node.workflowId}>
          <Td>
            <Checkbox
              isChecked={selectedWorkflows.includes(node.id)}
              onChange={() => {
                onWorkflowSelect(node.id);
              }}
            />
          </Td>
          <Td
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={node.workflowId ?? 'UNKNOWN workflow'}
            textColor="blue.500"
          >
            <Link to={`../executed/${node.workflowId}`}>{node.workflowId}</Link>
          </Td>
          <Td>{node.workflowName}</Td>
          <Td>{moment(node.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
          <Td>{node.endTime ? moment(node.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
          <Td>
            <ExecutedWorkflowStatusLabels status={node.status ?? 'UNKNOWN'} />
          </Td>
        </Tr>
      ))}
    </>
  );
};

export default ExecutedWorkflowFlatTableItem;
