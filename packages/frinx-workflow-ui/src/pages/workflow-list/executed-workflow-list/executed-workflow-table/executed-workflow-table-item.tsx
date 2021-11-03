import moment from 'moment';
import React, { ChangeEvent, FC } from 'react';
import { Tr, Td, Checkbox } from '@chakra-ui/react';
import { ExecutedWorkflow, NestedExecutedWorkflow } from '../../../../types/types';

type Props = {
  searchReducer: any;
  showFlat: boolean;
  sort: number[];
  showChildren: NestedExecutedWorkflow[];
  openParentWfs: ExecutedWorkflow[];
  selectedWfs: string[];
  indent(wf: NestedExecutedWorkflow[], i: number, size?: number | undefined): string;
  selectWf: (e: ChangeEvent<HTMLInputElement>) => void;
  showChildrenWorkflows(
    workflow: NestedExecutedWorkflow,
    closeParentWfs: NestedExecutedWorkflow[] | null,
    closeChildWfs: NestedExecutedWorkflow[] | null,
  ): void;
  dynamicSort(property: string): (
    a: {
      [key: string]: any;
    },
    b: {
      [key: string]: any;
    },
  ) => any;
  onExecutedWorkflowClick(workflowId: string): void;
};

const ExecutedWorkflowTableItem: FC<Props> = ({
  searchReducer,
  showFlat,
  sort,
  dynamicSort,
  showChildren,
  openParentWfs,
  selectWf,
  indent,
  selectedWfs,
  showChildrenWorkflows,
  onExecutedWorkflowClick,
}) => {
  const { data, parents, children } = searchReducer;
  const childSet: NestedExecutedWorkflow[] = children;
  const parentsId = childSet ? childSet.map((wf) => wf.parentWorkflowId) : [];
  let dataset: NestedExecutedWorkflow[] = showFlat ? data : parents;
  for (let i = 0; i < sort.length; i++) {
    if (i === 0 && sort[i] !== 2) dataset = dataset.sort(dynamicSort(sort[i] ? '-workflowType' : 'workflowType'));
    if (i === 1 && sort[i] !== 2) dataset = dataset.sort(dynamicSort(sort[i] ? '-startTime' : 'startTime'));
    if (i === 2 && sort[i] !== 2) dataset = dataset.sort(dynamicSort(sort[i] ? '-endTime' : 'endTime'));
  }
  return (
    <>
      {dataset.map((item, i) => (
        <Tr key={`row-${i}`} id={`row-${i}`}>
          <Td>
            <Checkbox
              isChecked={selectedWfs.includes(item.workflowId)}
              onChange={(e) => selectWf(e)}
              marginLeft={20}
              id={`chb-${i}`}
            />
          </Td>
          {showFlat ? null : (
            <Td
              cursor="pointer"
              onClick={() => showChildrenWorkflows(item, null, null)}
              style={{ textIndent: indent(dataset, i) }}
            >
              {parentsId.includes(item.workflowId) ? (
                openParentWfs.filter((wf) => wf.startTime === item.startTime).length ? (
                  <i className="fas fa-minus" />
                ) : (
                  <i className="fas fa-plus" />
                )
              ) : null}
            </Td>
          )}
          <Td
            onClick={() => onExecutedWorkflowClick(item.workflowId)}
            cursor="pointer"
            style={{
              textIndent: indent(dataset, i, 20),
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

export default ExecutedWorkflowTableItem;
