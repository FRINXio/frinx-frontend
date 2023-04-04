import React, { FC } from 'react';
import { Thead, Tr, Th, Checkbox, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';

type SortBy = 'workflowType' | 'startTime' | 'endTime' | 'status';
type SortOrder = 'ASC' | 'DESC';
type Props = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  areSelectedAll: boolean;
  sortWf: (sortBy: SortBy) => void;
  selectAllWorkflows: (isChecked: boolean) => void;
};

const ExecutedWorkflowTableHead: FC<Props> = ({ sortBy, sortOrder, sortWf, selectAllWorkflows, areSelectedAll }) => (
  <Thead>
    <Tr>
      <Th>
        <Checkbox onChange={(e) => selectAllWorkflows(e.target.checked)} isChecked={areSelectedAll} />
      </Th>
      <Th onClick={() => sortWf('workflowType')} cursor="pointer">
        Workflow ID
        {sortBy === 'workflowType' ? (
          <Icon as={FeatherIcon} size={40} icon={sortOrder === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => sortWf('workflowType')} cursor="pointer">
        Workflow name
        {sortBy === 'workflowType' ? (
          <Icon as={FeatherIcon} size={40} icon={sortOrder === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => sortWf('startTime')} cursor="pointer">
        Start Time
        {sortBy === 'startTime' ? (
          <Icon as={FeatherIcon} size={40} icon={sortOrder === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => sortWf('endTime')} cursor="pointer">
        End Time
        {sortBy === 'endTime' ? (
          <Icon as={FeatherIcon} size={40} icon={sortOrder === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => sortWf('status')} cursor="pointer">
        Status
        {sortBy === 'status' ? (
          <Icon as={FeatherIcon} size={40} icon={sortOrder === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
    </Tr>
  </Thead>
);

export default ExecutedWorkflowTableHead;
