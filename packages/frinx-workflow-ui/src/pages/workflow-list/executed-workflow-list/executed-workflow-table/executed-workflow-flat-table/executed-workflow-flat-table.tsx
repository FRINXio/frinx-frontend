import React, { FC } from 'react';
import { Table, Tbody, Box } from '@chakra-ui/react';
import { ExecutedWorkflowsFlat } from '../../../../../types/types';
import ExecutedWorkflowFlatTableItem from './executed-workflow-flat-table-item';
import ExecutedWorkflowTableHead from '../executed-workflow-table-head';

type Props = {
  sort: number[];
  flatWorkflows: ExecutedWorkflowsFlat;
  selectedWfs: string[];
  sortWf: (sortType: number) => void;
  selectWf: (workflowId: string, isChecked: boolean) => void;
  onExecutedWorkflowClick(workflowId: string): void;
};

const ExecutedWorkflowFlatTable: FC<Props> = ({
  sort,
  sortWf,
  onExecutedWorkflowClick,
  selectedWfs,
  selectWf,
  flatWorkflows,
}) => {
  return (
    <Box overflow="auto" maxHeight={550}>
      <Table background="white" variant="striped">
        <ExecutedWorkflowTableHead isFlatTable sort={sort} sortWf={sortWf} />
        <Tbody fontSize={13} textAlign="left">
          <ExecutedWorkflowFlatTableItem
            onExecutedWorkflowClick={onExecutedWorkflowClick}
            selectWf={selectWf}
            selectedWfs={selectedWfs}
            flatWorkflows={flatWorkflows}
          />
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowFlatTable;
