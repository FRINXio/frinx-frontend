import React, { FC } from 'react';
import { Thead, Tr, Th, Checkbox } from '@chakra-ui/react';

type Props = {
  sort: number[];
  isFlatTable?: boolean;
  areSelectedAll: boolean;
  sortWf: (sort: number) => void;
  selectAllWorkflows: (isChecked: boolean) => void;
};

const ExecutedWorkflowTableHead: FC<Props> = ({
  sort,
  sortWf,
  isFlatTable = false,
  selectAllWorkflows,
  areSelectedAll,
}) => {
  return (
    <Thead>
      <Tr>
        <Th>
          <Checkbox onChange={(e) => selectAllWorkflows(e.target.checked)} isChecked={areSelectedAll} />
        </Th>
        <Th onClick={() => sortWf(0)} cursor="pointer">
          Name &nbsp;
          {sort[0] !== 2 ? <i className={sort[0] ? 'fas fa-sort-up' : 'fas fa-sort-down'} /> : null}
        </Th>
        <Th>Status</Th>
        <Th onClick={() => sortWf(1)} cursor="pointer">
          Start Time &nbsp;
          {sort[1] !== 2 ? <i className={sort[1] ? 'fas fa-sort-down' : 'fas fa-sort-up'} /> : null}
        </Th>
        <Th onClick={() => sortWf(2)} cursor="pointer">
          End Time &nbsp;
          {sort[2] !== 2 ? <i className={sort[2] ? 'fas fa-sort-down' : 'fas fa-sort-up'} /> : null}
        </Th>
      </Tr>
    </Thead>
  );
};

export default ExecutedWorkflowTableHead;
