import React, { FC } from 'react';
import { Thead, Tr, Th, Checkbox, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { OrderBy, SortKey } from './executed-workflows.helpers';

type Props = {
  orderBy: OrderBy;
  isAllSelected: boolean;
  onSort: (sortProperty: SortKey) => void;
  onSelectAllWorkflows: () => void;
};

const ExecutedWorkflowsTableHead: FC<Props> = ({ onSelectAllWorkflows, isAllSelected, onSort, orderBy }) => (
  <Thead>
    <Tr>
      <Th>
        <Checkbox onChange={onSelectAllWorkflows} isChecked={isAllSelected} />
      </Th>
      <Th onClick={() => onSort('workflowName')} cursor="pointer">
        Workflow name
        {orderBy.sortKey === 'workflowName' ? (
          <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => onSort('startTime')} cursor="pointer">
        Start Time
        {orderBy.sortKey === 'startTime' ? (
          <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => onSort('endTime')} cursor="pointer">
        End Time
        {orderBy.sortKey === 'endTime' ? (
          <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => onSort('status')} cursor="pointer">
        Status
        {orderBy.sortKey === 'status' ? (
          <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
    </Tr>
  </Thead>
);

export default ExecutedWorkflowsTableHead;
