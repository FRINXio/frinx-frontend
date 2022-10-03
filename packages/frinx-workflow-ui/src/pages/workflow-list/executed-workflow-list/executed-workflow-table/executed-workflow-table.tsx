import React, { FC } from 'react';
import { Table, Tbody, Box } from '@chakra-ui/react';
import { ExecutedWorkflows } from '@frinx/workflow-ui/src/helpers/types';
import ExecutedWorkflowFlatTableItem from './executed-workflow-flat-table/executed-workflow-flat-table-item';
import ExecutedWorkflowTableHead from './executed-workflow-table-head';
import ExecutedWorkflowHierarchicalTableItem from './executed-workflow-hierarchical-table/executed-workflow-hierarchical-table-item';

type SortBy = 'workflowType' | 'startTime' | 'endTime' | 'status';
type SortOrder = 'ASC' | 'DESC';
type Props = {
  isFlat: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
  workflows: ExecutedWorkflows['result']['hits'];
  selectedWfs: string[];
  selectAllWorkflows: (isChecked: boolean) => void;
  sortWf: (sortBy: SortBy) => void;
  selectWf: (workflowId: string, isChecked: boolean) => void;
};

const ExecutedWorkflowTable: FC<Props> = ({
  isFlat,
  sortBy,
  sortOrder,
  sortWf,
  selectedWfs,
  selectWf,
  workflows,
  selectAllWorkflows,
}) => {
  const areSelectedAll = workflows.length === selectedWfs.length;

  return (
    <Box marginBottom={10}>
      <Table background="white" variant="striped" size="sm">
        <ExecutedWorkflowTableHead
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortWf={sortWf}
          selectAllWorkflows={selectAllWorkflows}
          areSelectedAll={areSelectedAll}
        />
        <Tbody fontSize={13} textAlign="left">
          {isFlat ? (
            <ExecutedWorkflowFlatTableItem selectWf={selectWf} selectedWfs={selectedWfs} flatWorkflows={workflows} />
          ) : (
            <ExecutedWorkflowHierarchicalTableItem
              selectWf={selectWf}
              selectedWfs={selectedWfs}
              workflows={workflows}
            />
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowTable;
