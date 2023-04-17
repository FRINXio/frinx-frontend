import moment from 'moment';
import React, { FC } from 'react';
import { Tr, Td, Checkbox } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ExecutedWorkflowsQuery } from '../../../../../__generated__/graphql';
import ExecutedWorkflowStatusLabels from '../executed-workflow-status-labels';

type Props = {
  workflows: ExecutedWorkflowsQuery;
  selectedWorkflows: string[];
  onWorkflowSelect: (workflowId: string) => void;
};

const ExecutedWorkflowFlatTableItem: FC<Props> = ({ workflows, onWorkflowSelect, selectedWorkflows }) => {
  return (
    <>
      {workflows.executedWorkflows?.edges.map(({ node }) => (
        <Tr key={node.workflowId}>
          <Td>
            <Checkbox
              isChecked={selectedWorkflows.includes(node.id)}
              onChange={() => {
                onWorkflowSelect(node.id)
              }}
            />
          </Td>
          <Td
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={node.workflowId ?? "UNKNOWN workflow"}
            textColor="blue.500"
          >
            <Link to={`../executed/${node.workflowId}`}>{node.workflowId}</Link>
          </Td>
          <Td>{node.workflowName}</Td>
          <Td>{moment(node.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
          <Td>{node.endTime ? moment(node.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
          <Td><ExecutedWorkflowStatusLabels status={node.status ?? 'UNKNOWN'} /></Td>
        </Tr>
      ))}
    </>
  );
};

export default ExecutedWorkflowFlatTableItem;
