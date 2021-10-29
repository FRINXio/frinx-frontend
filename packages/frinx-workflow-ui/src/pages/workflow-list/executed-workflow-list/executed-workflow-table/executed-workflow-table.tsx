import React, { ChangeEvent, FC } from 'react';
import { Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import ExecutedWorkflowTableItem from './executed-workflow-table-item';
import { ExecutedWorkflow, NestedExecutedWorkflow } from '../../../../types/types';

type Props = {
  showFlat: boolean;
  isLoading: boolean;
  sort: number[];
  searchReducer: any;
  showChildren: NestedExecutedWorkflow[];
  openParentWfs: ExecutedWorkflow[];
  selectedWfs: string[];
  sortWf: (sortType: number) => void;
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

const ExecutedWorkflowTable: FC<Props> = ({
  showFlat,
  sort,
  sortWf,
  onExecutedWorkflowClick,
  showChildrenWorkflows,
  selectedWfs,
  indent,
  selectWf,
  openParentWfs,
  showChildren,
  dynamicSort,
  searchReducer,
}) => {
  return (
    <div className="execTableWrapper">
      <Table background="white" variant={showFlat ? 'striped' : 'simple'}>
        <Thead>
          <Tr>
            <Th> </Th>
            {showFlat ? null : <Th>Children</Th>}
            <Th onClick={() => sortWf(0)} className="clickable">
              Name &nbsp;
              {sort[0] !== 2 ? <i className={sort[0] ? 'fas fa-sort-up' : 'fas fa-sort-down'} /> : null}
            </Th>
            <Th>Status</Th>
            <Th onClick={() => sortWf(1)} className="clickable">
              Start Time &nbsp;
              {sort[1] !== 2 ? <i className={sort[1] ? 'fas fa-sort-down' : 'fas fa-sort-up'} /> : null}
            </Th>
            <Th onClick={() => sortWf(2)} className="clickable">
              End Time &nbsp;
              {sort[2] !== 2 ? <i className={sort[2] ? 'fas fa-sort-down' : 'fas fa-sort-up'} /> : null}
            </Th>
          </Tr>
        </Thead>
        <Tbody className="execTableRows">
          <ExecutedWorkflowTableItem
            sort={sort}
            showFlat={showFlat}
            dynamicSort={dynamicSort}
            indent={indent}
            showChildrenWorkflows={showChildrenWorkflows}
            onExecutedWorkflowClick={onExecutedWorkflowClick}
            openParentWfs={openParentWfs}
            searchReducer={searchReducer}
            selectWf={selectWf}
            selectedWfs={selectedWfs}
            showChildren={showChildren}
          />
        </Tbody>
      </Table>
    </div>
  );
};

export default ExecutedWorkflowTable;
