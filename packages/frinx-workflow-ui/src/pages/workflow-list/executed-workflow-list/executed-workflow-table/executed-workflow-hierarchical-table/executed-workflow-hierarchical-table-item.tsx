import moment from 'moment';
import React, { FC } from 'react';
import { Tr, Td, Checkbox } from '@chakra-ui/react';
import {
  ExecutedWorkflow,
  ExecutedWorkflowsHierarchical,
  NestedExecutedWorkflow,
} from '@frinx/workflow-ui/src/helpers/types';

type Props = {
  hierarchicalWorkflows: ExecutedWorkflowsHierarchical;
  openParentWfs: ExecutedWorkflow[];
  selectedWfs: string[];
  indent(wf: ExecutedWorkflow[], i: number, size?: number | undefined): string;
  selectWf: (workflowId: string, isChecked: boolean) => void;
  showChildrenWorkflows(
    workflow: ExecutedWorkflow,
    children: NestedExecutedWorkflow[],
    closeParentWfs: NestedExecutedWorkflow[] | null,
    closeChildWfs: NestedExecutedWorkflow[] | null,
  ): void;
  onExecutedWorkflowClick(workflowId: string): void;
  onRightClick: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, workflowId: string) => void;
};

const ExecutedWorkflowTableHierarchicalItem: FC<Props> = ({
  hierarchicalWorkflows,
  selectWf,
  selectedWfs,
  onExecutedWorkflowClick,
  onRightClick,
}) => {
  let { parents } = hierarchicalWorkflows;

  return (
    <>
      {parents.map((item) => (
        <Tr key={item.workflowId} onContextMenu={(e) => onRightClick(e, item.workflowId)}>
          <Td>
            <Checkbox
              isChecked={selectedWfs.includes(item.workflowId)}
              onChange={(e) => selectWf(item.workflowId, e.target.checked)}
            />
          </Td>
          <Td
            onClick={() => onExecutedWorkflowClick(item.workflowId)}
            cursor="pointer"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={item.workflowType}
          >
            {item.workflowType}
          </Td>
          <Td>{item.status}</Td>
          <Td>{moment(item.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
          <Td>{item.endTime ? moment(item.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
        </Tr>
      ))}
    </>
  );
};

export default ExecutedWorkflowTableHierarchicalItem;
