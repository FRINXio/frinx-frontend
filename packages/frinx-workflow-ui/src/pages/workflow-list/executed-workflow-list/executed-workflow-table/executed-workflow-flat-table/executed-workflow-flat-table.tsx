import React, { FC } from 'react';
import { Table, Tbody, Box } from '@chakra-ui/react';
import { ExecutedWorkflowsFlat } from '@frinx/workflow-ui/src/helpers/types';
import ExecutedWorkflowFlatTableItem from './executed-workflow-flat-table-item';
import ExecutedWorkflowTableHead from '../executed-workflow-table-head';

type Props = {
  sort: number[];
  flatWorkflows: ExecutedWorkflowsFlat;
  selectedWfs: string[];
  selectAllWorkflows: (isChecked: boolean) => void;
  sortWf: (sortType: number) => void;
  selectWf: (workflowId: string, isChecked: boolean) => void;
};

const ExecutedWorkflowFlatTable: FC<Props> = ({
  sort,
  sortWf,
  selectedWfs,
  selectWf,
  flatWorkflows,
  selectAllWorkflows,
}) => {
  const areSelectedAll = flatWorkflows.result.hits.length === selectedWfs.length;
  return (
    <Box marginBottom={10}>
      <Table background="white" variant="striped">
        <ExecutedWorkflowTableHead
          isFlatTable
          sort={sort}
          sortWf={sortWf}
          selectAllWorkflows={selectAllWorkflows}
          areSelectedAll={areSelectedAll}
        />
        <Tbody fontSize={13} textAlign="left">
          <ExecutedWorkflowFlatTableItem selectWf={selectWf} selectedWfs={selectedWfs} flatWorkflows={flatWorkflows} />
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowFlatTable;
