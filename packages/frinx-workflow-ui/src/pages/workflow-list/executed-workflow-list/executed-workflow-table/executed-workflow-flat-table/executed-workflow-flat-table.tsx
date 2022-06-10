import React, { FC } from 'react';
import { Table, Tbody, Box } from '@chakra-ui/react';
import { ExecutedWorkflows } from '@frinx/workflow-ui/src/helpers/types';
import ExecutedWorkflowFlatTableItem from './executed-workflow-flat-table-item';
import ExecutedWorkflowTableHead from '../executed-workflow-table-head';

type SortBy = 'workflowId' | 'startTime' | 'endTime';
type SortOrder = 'ASC' | 'DESC';
type Props = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  workflows: ExecutedWorkflows;
  selectedWfs: string[];
  selectAllWorkflows: (isChecked: boolean) => void;
  sortWf: (sortBy: SortBy) => void;
  selectWf: (workflowId: string, isChecked: boolean) => void;
};

const ExecutedWorkflowFlatTable: FC<Props> = ({
  sortBy,
  sortOrder,
  sortWf,
  selectedWfs,
  selectWf,
  workflows,
  selectAllWorkflows,
}) => {
  const areSelectedAll = workflows.result.hits.length === selectedWfs.length;
  return (
    <Box marginBottom={10}>
      <Table background="white" variant="striped">
        <ExecutedWorkflowTableHead
          isFlatTable
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortWf={sortWf}
          selectAllWorkflows={selectAllWorkflows}
          areSelectedAll={areSelectedAll}
        />
        <Tbody fontSize={13} textAlign="left">
          <ExecutedWorkflowFlatTableItem selectWf={selectWf} selectedWfs={selectedWfs} flatWorkflows={workflows} />
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowFlatTable;
