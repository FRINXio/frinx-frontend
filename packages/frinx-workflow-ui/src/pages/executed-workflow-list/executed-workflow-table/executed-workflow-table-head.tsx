import React, { FC } from 'react';
import { Thead, Tr, Th, Checkbox, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { OrderBy, SortKey } from '../executed-workflow-list';

type Props = {
  sort: OrderBy;
  areAllWorkflowsSelected: boolean;
  handleOnSort: (sortProperty: SortKey) => void;
  onSelectAllWorkflows: () => void;
};

const ExecutedWorkflowTableHead: FC<Props> = ({
  onSelectAllWorkflows,
  areAllWorkflowsSelected,
  handleOnSort,
  sort,
}) => (
  <Thead>
    <Tr>
      <Th>
        <Checkbox onChange={onSelectAllWorkflows} isChecked={areAllWorkflowsSelected} />
      </Th>
      <Th onClick={() => handleOnSort('workflowId')} cursor="pointer">
        Workflow ID
        {sort.sortKey === 'workflowId' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => handleOnSort('workflowName')} cursor="pointer">
        Workflow name
        {sort.sortKey === 'workflowName' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => handleOnSort('startTime')} cursor="pointer">
        Start Time
        {sort.sortKey === 'startTime' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => handleOnSort('endTime')} cursor="pointer">
        End Time
        {sort.sortKey === 'endTime' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => handleOnSort('status')} cursor="pointer">
        Status
        {sort.sortKey === 'status' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
    </Tr>
  </Thead>
);

export default ExecutedWorkflowTableHead;
