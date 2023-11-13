import React, { FC } from 'react';
import { Table, Tbody, Box, Text } from '@chakra-ui/react';
import ExecutedWorkflowFlatTableItem from './executed-workflow-flat-table/executed-workflow-flat-table-item';
import ExecutedWorkflowTableHead from './executed-workflow-table-head';
import ExecutedWorkflowHierarchicalTableItem from './executed-workflow-hierarchical-table/executed-workflow-hierarchical-table-item';
import { WorkflowStatus, ExecutedWorkflowsQuery } from '../../../__generated__/graphql';
import { SortKey, OrderBy } from '../executed-workflow-list';

type Props = {
  isFlat: boolean;
  sort: OrderBy;
  workflows: ExecutedWorkflowsQuery;
  selectedWorkflows: string[];
  handleOnSort: (value: SortKey) => void;
  onSelectAllWorkflows: () => void;
  onWorkflowSelect: (workflowId: string) => void;
  onWorkflowStatusClick?: (status: WorkflowStatus | 'UNKNOWN') => void;
};

const ExecutedWorkflowTable: FC<Props> = ({
  isFlat,
  workflows,
  onSelectAllWorkflows,
  onWorkflowSelect,
  onWorkflowStatusClick,
  selectedWorkflows,
  handleOnSort,
  sort,
}) => {
  const areAllWorkflowsSelected = workflows.conductor.executedWorkflows?.edges.length === selectedWorkflows.length;
  const areThereAnyExecutedWorkflows =
    workflows.conductor.executedWorkflows != null && workflows.conductor.executedWorkflows.edges.length > 0;

  return (
    <Box marginBottom={10}>
      <Table background="white" size="md">
        <ExecutedWorkflowTableHead
          sort={sort}
          onSelectAllWorkflows={onSelectAllWorkflows}
          areAllWorkflowsSelected={areAllWorkflowsSelected}
          handleOnSort={handleOnSort}
        />
        {!areThereAnyExecutedWorkflows && <Text>There no executed workflows</Text>}
        {workflows.conductor.executedWorkflows != null && (
          <Tbody fontSize={13} textAlign="left">
            {isFlat ? (
              <ExecutedWorkflowFlatTableItem
                onWorkflowSelect={onWorkflowSelect}
                onWorkflowStatusClick={onWorkflowStatusClick}
                selectedWorkflows={selectedWorkflows}
                workflows={workflows}
              />
            ) : (
              <ExecutedWorkflowHierarchicalTableItem
                onWorkflowSelect={onWorkflowSelect}
                selectedWorkflows={selectedWorkflows}
                workflows={workflows.conductor.executedWorkflows}
                onWorkflowStatusClick={onWorkflowStatusClick}
              />
            )}
          </Tbody>
        )}
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowTable;
