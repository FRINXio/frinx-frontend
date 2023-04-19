import React, { FC } from 'react';
import { Table, Tbody, Box, Text } from '@chakra-ui/react';
import ExecutedWorkflowFlatTableItem from './executed-workflow-flat-table/executed-workflow-flat-table-item';
import ExecutedWorkflowTableHead from './executed-workflow-table-head';
import ExecutedWorkflowHierarchicalTableItem from './executed-workflow-hierarchical-table/executed-workflow-hierarchical-table-item';
import { ExecutedWorkflowsQuery } from '../../../../__generated__/graphql';
import { SortProperty } from '../executed-workflow-list';

type Props = {
  isFlat: boolean;
  sort: SortProperty;
  onSortPropertyClick: (sortProperty: SortProperty) => void;
  workflows: ExecutedWorkflowsQuery;
  selectedWorkflows: string[];
  onSelectAllWorkflows: () => void;
  onWorkflowSelect: (workflowId: string) => void;
};

const ExecutedWorkflowTable: FC<Props> = ({
  isFlat,
  workflows,
  onSelectAllWorkflows,
  onSortPropertyClick,
  onWorkflowSelect,
  selectedWorkflows,
  sort,
}) => {
  const areAllWorkflowsSelected = workflows.executedWorkflows?.edges.length === selectedWorkflows.length;
  const areThereAnyExecutedWorkflows =
    workflows.executedWorkflows != null &&
    workflows.executedWorkflows.edges.length > 0;

  return (
    <Box marginBottom={10}>
      <Table background="white" size="md">
        <ExecutedWorkflowTableHead
          onSelectAllWorkflows={onSelectAllWorkflows}
          areAllWorkflowsSelected={areAllWorkflowsSelected}
          onSortPropertyClick={onSortPropertyClick}
          sort={sort}
        />
        {!areThereAnyExecutedWorkflows && <Text>There no executed workflows</Text>}

        {workflows.executedWorkflows != null && (
          <Tbody fontSize={13} textAlign="left">
            {isFlat ? (
              <ExecutedWorkflowFlatTableItem
                onWorkflowSelect={onWorkflowSelect}
                selectedWorkflows={selectedWorkflows}
                workflows={workflows}
                sort={sort}
              />
            ) : (
              <ExecutedWorkflowHierarchicalTableItem
                onWorkflowSelect={onWorkflowSelect}
                selectedWorkflows={selectedWorkflows}
                workflows={workflows.executedWorkflows}
                sort={sort}
              />
            )}
          </Tbody>
        )}
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowTable;
