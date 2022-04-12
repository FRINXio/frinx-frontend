import React, { FC } from 'react';
import { Table, Tbody, Box } from '@chakra-ui/react';
import {
  ExecutedWorkflow,
  ExecutedWorkflowsHierarchical,
  NestedExecutedWorkflow,
} from '@frinx/workflow-ui/src/helpers/types';
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
};

const ExecutedWorkflowHierarchicalTable: FC<Props> = ({
  sort,
  sortWf,
  showChildrenWorkflows,
  selectedWfs,
  indent,
  selectWf,
  openParentWfs,
  hierarchicalWorkflows,
  selectAllWorkflows,
}) => {
  const areSelectedAll = hierarchicalWorkflows.parents.length === selectedWfs.length;

  return (
    <Box marginBottom={10}>
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
