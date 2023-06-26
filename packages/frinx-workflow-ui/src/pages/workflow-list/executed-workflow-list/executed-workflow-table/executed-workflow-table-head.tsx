import React, { FC } from 'react';
import { Thead, Tr, Th, Checkbox, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { SortProperty } from '../executed-workflow-list';

type Props = {
  sort: SortProperty;
  areAllWorkflowsSelected: boolean;
  onSortPropertyClick: (sortProperty: SortProperty) => void;
  onSelectAllWorkflows: () => void;
};

const ExecutedWorkflowTableHead: FC<Props> = ({
  onSelectAllWorkflows,
  areAllWorkflowsSelected,
  onSortPropertyClick,
  sort,
}) => (
  <Thead>
    <Tr>
      <Th>
        <Checkbox onChange={onSelectAllWorkflows} isChecked={areAllWorkflowsSelected} />
      </Th>
      <Th onClick={() => onSortPropertyClick({ key: 'workflowId', value: sort.value })} cursor="pointer">
        Workflow ID
        {sort.key === 'workflowId' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.value === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => onSortPropertyClick({ key: 'workflowName', value: sort.value })} cursor="pointer">
        Workflow name
        {sort.key === 'workflowName' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.value === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => onSortPropertyClick({ key: 'startTime', value: sort.value })} cursor="pointer">
        Start Time
        {sort.key === 'startTime' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.value === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => onSortPropertyClick({ key: 'endTime', value: sort.value })} cursor="pointer">
        End Time
        {sort.key === 'endTime' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.value === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
      <Th onClick={() => onSortPropertyClick({ key: 'status', value: sort.value })} cursor="pointer">
        Status
        {sort.key === 'status' ? (
          <Icon as={FeatherIcon} size={40} icon={sort.value === 'ASC' ? 'chevron-down' : 'chevron-up'} />
        ) : null}
      </Th>
    </Tr>
  </Thead>
);

export default ExecutedWorkflowTableHead;
