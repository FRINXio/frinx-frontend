import React, { FC } from 'react';
import { Thead, Tr, Th, Checkbox } from '@chakra-ui/react';

type SortBy = 'workflowType' | 'startTime' | 'endTime' | 'status';
type SortOrder = 'ASC' | 'DESC';
type Props = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  isFlatTable?: boolean;
  areSelectedAll: boolean;
  sortWf: (sortBy: SortBy) => void;
  selectAllWorkflows: (isChecked: boolean) => void;
};

const ExecutedWorkflowTableHead: FC<Props> = ({
  sortBy,
  sortOrder,
  sortWf,
  isFlatTable = false,
  selectAllWorkflows,
  areSelectedAll,
}) => (
    <Thead>
      <Tr>
        <Th>
          <Checkbox onChange={(e) => selectAllWorkflows(e.target.checked)} isChecked={areSelectedAll} />
        </Th>
        <Th onClick={() => sortWf('workflowType')} cursor="pointer">
          Name &nbsp;
          {sortBy === 'workflowType' ? (
            <i className={sortOrder === 'ASC' ? 'fas fa-sort-up' : 'fas fa-sort-down'} />
          ) : null}
        </Th>
        <Th onClick={() => sortWf('status')} cursor="pointer">
          Status &nbsp;
          {sortBy === 'status' ? <i className={sortOrder === 'ASC' ? 'fas fa-sort-down' : 'fas fa-sort-up'} /> : null}
        </Th>
        <Th onClick={() => sortWf('startTime')} cursor="pointer">
          Start Time &nbsp;
          {sortBy === 'startTime' ? (
            <i className={sortOrder === 'ASC' ? 'fas fa-sort-down' : 'fas fa-sort-up'} />
          ) : null}
        </Th>
        <Th onClick={() => sortWf('endTime')} cursor="pointer">
          End Time &nbsp;
          {sortBy == 'endTime' ? <i className={sortOrder === 'ASC' ? 'fas fa-sort-down' : 'fas fa-sort-up'} /> : null}
        </Th>
      </Tr>
    </Thead>
  );

export default ExecutedWorkflowTableHead;
