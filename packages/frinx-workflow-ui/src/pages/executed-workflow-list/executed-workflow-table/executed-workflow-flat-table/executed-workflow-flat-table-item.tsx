import { Checkbox, Td, Tr } from '@chakra-ui/react';
import moment from 'moment';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ExecutedWorkflowsQuery, ExecutedWorkflowStatus } from '../../../../__generated__/graphql';
import ExecutedWorkflowStatusLabels from '../executed-workflow-status-labels';

type Props = {
  workflows: ExecutedWorkflowsQuery;
  selectedWorkflows: string[];
  onWorkflowSelect: (workflowId: string) => void;
  onWorkflowStatusClick?: (status: ExecutedWorkflowStatus | 'UNKNOWN') => void;
};

const ExecutedWorkflowFlatTableItem: FC<Props> = ({
  workflows,
  selectedWorkflows,
  onWorkflowSelect,
  onWorkflowStatusClick,
}) => {
  if (workflows.executedWorkflows?.edges == null || workflows.executedWorkflows?.edges.length === 0) {
    return (
      <Tr>
        <Td>No executed workflows available</Td>
      </Tr>
    );
  }

  return (
    <>
      {workflows.executedWorkflows.edges.map(({ node }) => {
        console.log(node);
        return (
          <Tr key={node.id}>
            <Td>
              <Checkbox
                isChecked={selectedWorkflows.includes(node.id)}
                onChange={() => {
                  onWorkflowSelect(node.id);
                }}
              />
            </Td>
            <Td
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
              title={node.workflowId ?? 'UNKNOWN workflow'}
              textColor="blue.500"
            >
              <Link to={`../executed/${node.id}`}>{node.id}</Link>
            </Td>
            <Td>{node.workflowDefinition.name}</Td>
            <Td>{moment(node.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
            <Td>{node.endTime ? moment(node.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
            <Td>
              <ExecutedWorkflowStatusLabels status={node.status ?? 'UNKNOWN'} onClick={onWorkflowStatusClick} />
            </Td>
          </Tr>
        );
      })}
    </>
  );
};

export default ExecutedWorkflowFlatTableItem;
