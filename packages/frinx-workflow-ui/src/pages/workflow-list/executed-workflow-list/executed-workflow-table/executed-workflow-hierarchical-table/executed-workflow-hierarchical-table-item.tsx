import moment from 'moment';
import React, { FC } from 'react';
import { Tr, Td, Checkbox } from '@chakra-ui/react';
import { ExecutedWorkflow, ExecutedWorkflowsHierarchical, NestedExecutedWorkflow } from '../../../../../types/types';

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
};

const ExecutedWorkflowTableHierarchicalItem: FC<Props> = ({
  hierarchicalWorkflows,
  openParentWfs,
  selectWf,
  indent,
  selectedWfs,
  showChildrenWorkflows,
  onExecutedWorkflowClick,
}) => {
  let { parents, children } = hierarchicalWorkflows;
  const parentsId = children.map((wf) => wf.parentWorkflowId);
  return (
    <>
      {parents.map((item, i) => (
        <Tr key={item.workflowId}>
          <Td>
            <Checkbox
              isChecked={selectedWfs.includes(item.workflowId)}
              onChange={(e) => selectWf(item.workflowId, e.target.checked)}
              marginLeft={20}
            />
          </Td>
          <Td
            cursor="pointer"
            onClick={() => showChildrenWorkflows(item, children, null, null)}
            style={{ textIndent: indent(parents, i) }}
          >
            {parentsId.includes(item.workflowId) ? (
              openParentWfs.filter((wf) => wf.startTime === item.startTime).length ? (
                <i className="fas fa-minus" />
              ) : (
                <i className="fas fa-plus" />
              )
            ) : null}
          </Td>
          <Td
            onClick={() => onExecutedWorkflowClick(item.workflowId)}
            cursor="pointer"
            style={{
              textIndent: indent(parents, i, 20),
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
