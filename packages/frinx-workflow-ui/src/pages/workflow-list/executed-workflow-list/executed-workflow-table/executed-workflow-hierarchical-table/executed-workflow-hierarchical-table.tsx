import React, { FC } from 'react';
import { Table, Tbody, Box } from '@chakra-ui/react';
import { ExecutedWorkflow, ExecutedWorkflowsHierarchical, NestedExecutedWorkflow } from '../../../../../types/types';
import ExecutedWorkflowTableHierarchicalItem from './executed-workflow-hierarchical-table-item';
import ExecutedWorkflowTableHead from '../executed-workflow-table-head';

type Props = {
  sort: number[];
  hierarchicalWorkflows: ExecutedWorkflowsHierarchical;
  openParentWfs: ExecutedWorkflow[];
  selectedWfs: string[];
  selectAllWorkflows: (isChecked: boolean) => void;
  sortWf: (sortType: number) => void;
  indent(wf: ExecutedWorkflow[], i: number, size?: number | undefined): string;
  selectWf: (workflowId: string, isChecked: boolean) => void;
  showChildrenWorkflows(
    workflow: ExecutedWorkflow,
    children: NestedExecutedWorkflow[],
    closeParentWfs: NestedExecutedWorkflow[] | null,
    closeChildWfs: NestedExecutedWorkflow[] | null,
  ): void;
  onExecutedWorkflowClick(workflowId: string): void;
};

const ExecutedWorkflowHierarchicalTable: FC<Props> = ({
  sort,
  sortWf,
  onExecutedWorkflowClick,
  showChildrenWorkflows,
  selectedWfs,
  indent,
  selectWf,
  openParentWfs,
  hierarchicalWorkflows,
  selectAllWorkflows,
}) => {
  const areSelectedAll =
    hierarchicalWorkflows.children.length + hierarchicalWorkflows.parents.length === selectedWfs.length;

  return (
    <Box overflow="auto" maxHeight={550}>
      <Table background="white" variant="simple">
        <ExecutedWorkflowTableHead
          sort={sort}
          sortWf={sortWf}
          selectAllWorkflows={selectAllWorkflows}
          areSelectedAll={areSelectedAll}
        />
        <Tbody fontSize={13} textAlign="left">
          <ExecutedWorkflowTableHierarchicalItem
            indent={indent}
            showChildrenWorkflows={showChildrenWorkflows}
            onExecutedWorkflowClick={onExecutedWorkflowClick}
            openParentWfs={openParentWfs}
            selectWf={selectWf}
            selectedWfs={selectedWfs}
            hierarchicalWorkflows={hierarchicalWorkflows}
          />
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowHierarchicalTable;
