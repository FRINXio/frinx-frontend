import PageContainer from '../../../common/PageContainer';
import React, { FC, useEffect, useState } from 'react';
import { Progress } from '@chakra-ui/react';
import { ExecutedWorkflowsFlat, ExecutedWorkflowsHierarchical, NestedExecutedWorkflow } from '../../../types/types';
import ExecutedWorkflowSearchBox from './executed-workflow-searchbox/executed-workflow-searchbox';
import {
  fetchNewData,
  fetchParentWorkflows,
  getOrderValue,
  getSortValue,
  getValueOfProperty,
  isValid,
} from './search-execs';
import ExecutedWorkflowHierarchicalTable from './executed-workflow-table/executed-workflow-hierarchical-table/executed-workflow-hierarchical-table';
import ExecutedWorkflowFlatTable from './executed-workflow-table/executed-workflow-flat-table/executed-workflow-flat-table';
import { orderBy } from 'lodash';
import { Previous } from 'chakra-paginator';
import ExecutedWorkflowBulkOperationsBlock from './executed-workflow-bulk-operations-block/executed-workflow-bulk-operations';

type Props = {
  onWorkflowIdClick: (workflowId: string) => void;
};

type StateProps = {
  selectedWorkflows: string[];
  detailsModal: boolean;
  workflowId: string;
  openParentWfs: NestedExecutedWorkflow[];
  isFlat: boolean;
  showChildren: NestedExecutedWorkflow[];
  defaultPages: number;
  viewedPage: number;
  sort: number[];
  labels: string[];
};

const initialState = {
  selectedWorkflows: [],
  detailsModal: false,
  workflowId: '',
  openParentWfs: [],
  isFlat: false,
  showChildren: [],
  defaultPages: 20,
  viewedPage: 1,
  sort: [2, 2, 2],
  labels: [],
};

const ExecutedWorkflowList: FC<Props> = ({ onWorkflowIdClick }) => {
  const [state, setState] = useState<StateProps>(initialState);
  const [flatWorkflows, setFlatWorkflows] = useState<ExecutedWorkflowsFlat | null>(null);
  const [hierarchicalWorkflows, setHierarchicalWorkflows] = useState<ExecutedWorkflowsHierarchical | null>(null);

  useEffect(() => {
    fetchNewData(state.workflowId, state.viewedPage, state.defaultPages, state.labels).then((response) => {
      setFlatWorkflows(response);
    });
    fetchParentWorkflows(state.workflowId, state.viewedPage, state.defaultPages, state.labels).then((response) => {
      setHierarchicalWorkflows(response);
    });
  }, []);

  useEffect(() => {
    setState((prev) => ({ ...prev, selectedWorkflows: [...new Set<string>()] }));
  }, [state.isFlat]);

  if (hierarchicalWorkflows == null || flatWorkflows == null) {
    return <Progress isIndeterminate size="xs" marginTop={-10} />;
  }

  const update = (openParents: NestedExecutedWorkflow[], showChildren: NestedExecutedWorkflow[]) => {
    setState((prev) => {
      return {
        ...prev,
        openParentWfs: openParents,
        showChildren: showChildren,
      };
    });
  };

  const showChildrenWorkflows = (
    workflow: NestedExecutedWorkflow,
    children: NestedExecutedWorkflow[],
    closeParentWfs: NestedExecutedWorkflow[] | null,
    closeChildWfs: NestedExecutedWorkflow[] | null,
  ) => {
    if (children.length) {
      children.forEach((wf, index: number) => (wf.index = index));
    }

    let showChildren = closeChildWfs ? closeChildWfs : state.showChildren;
    let openParents = closeParentWfs ? closeParentWfs : state.openParentWfs;

    if (openParents.filter((wfs) => wfs.startTime === workflow.startTime).length) {
      const closeParents = openParents.filter((wf) => wf.parentWorkflowId === workflow.workflowId);
      openParents = openParents.filter((wfs) => wfs.startTime !== workflow.startTime);
      showChildren = showChildren.filter((wf) => wf.parentWorkflowId !== workflow.workflowId);
      closeParents.length
        ? closeParents.forEach((open) => showChildrenWorkflows(open, children, openParents, showChildren))
        : update(openParents, showChildren);
    } else {
      openParents.push(workflow);
      showChildren = showChildren.concat(children.filter((wf) => wf.parentWorkflowId === workflow.workflowId));
      update(openParents, showChildren);
    }
  };

  const changeLabels = (labels: string[]) => {
    setState((prev) => ({ ...prev, labels }));
  };

  const changeQuery = (query: string) => {
    setState((prev) => ({ ...prev, workflowId: query }));
  };

  const indent = (wf: NestedExecutedWorkflow[], i: number, size?: number) => {
    const indentSize = size ? size : 6;
    if (wf[i].parentWorkflowId) {
      let layers = 0;
      if (state.showChildren.some((child) => child.workflowId === wf[i].parentWorkflowId)) {
        let parent = wf[i];
        while (parent.parentWorkflowId) {
          layers++;
          parent = wf[wf.findIndex((id) => id.workflowId === parent.parentWorkflowId)];
          if (layers > 10) break;
        }
        return layers * indentSize + 'px';
      }
      return indentSize + 'px';
    }
    return '0px';
  };

  const setView = () => {
    setState((prev) => ({ ...prev, isFlat: !prev.isFlat }));
  };

  const selectWf = (workflowId: string, isChecked: boolean) => {
    let selectedWorkflows = new Set(state.selectedWorkflows);

    if (isChecked) {
      selectedWorkflows.add(workflowId);
    } else {
      selectedWorkflows.delete(workflowId);
    }

    setState((prev) => {
      return {
        ...prev,
        selectedWorkflows: [...selectedWorkflows],
      };
    });
  };

  const selectAllWorkflows = (isChecked: boolean) => {
    if (isChecked) {
      setState((prev) => {
        let selectedWorkflows: Set<string>;
        if (state.isFlat) {
          selectedWorkflows = new Set(flatWorkflows.result.hits.map((workflow) => workflow.workflowId));
        } else {
          selectedWorkflows = new Set(
            hierarchicalWorkflows.children
              .map((workflow) => workflow.workflowId)
              .concat(hierarchicalWorkflows.parents.map((workflow) => workflow.workflowId)),
          );
        }

        return { ...prev, selectedWorkflows: [...selectedWorkflows] };
      });
    } else {
      setState((prev) => ({ ...prev, selectedWorkflows: [] }));
    }
  };

  const selectChildrenWf = (parentId: string, wfIds: string[]) => {
    const { children } = hierarchicalWorkflows;
    const newWfIds = children
      .filter((wf: NestedExecutedWorkflow) => wf.parentWorkflowId === parentId)
      .map((wf: NestedExecutedWorkflow) => wf.workflowId);
    for (let i = 0; i < newWfIds.length; i++) wfIds = wfIds.concat(selectChildrenWf(newWfIds[i], newWfIds));
    return [...new Set(wfIds)];
  };

  const sortWf = (sortId: number) => {
    const sort = state.sort.map((value, i) => (sortId === i ? getSortValue(value) : 2));
    if (!state.isFlat) {
      state.openParentWfs.forEach((parent) =>
        showChildrenWorkflows(parent, hierarchicalWorkflows.children, null, null),
      );
      update([], []);
    }
    setState((prev) => ({
      ...prev,
      sort,
    }));
  };

  const changeView = () => {
    setView();
  };

  const hierarchy: ExecutedWorkflowsHierarchical = {
    parents: orderBy(
      hierarchicalWorkflows.parents.filter((parent) => isValid(parent, state.workflowId, state.labels)) ?? [],
      [getValueOfProperty(state.sort)],
      [getOrderValue(state.sort)],
    ),
    children: orderBy(
      hierarchicalWorkflows.children.filter((child) => isValid(child, state.workflowId, state.labels)) ?? [],
      [getValueOfProperty(state.sort)],
      [getOrderValue(state.sort)],
    ),
    count: hierarchicalWorkflows.count ?? 0,
    hits: hierarchicalWorkflows.hits ?? 0,
  };

  const flat: ExecutedWorkflowsFlat = {
    result: {
      hits: orderBy(
        flatWorkflows.result.hits.filter((workflow) => isValid(workflow, state.workflowId, state.labels)) ?? [],
        [getValueOfProperty(state.sort)],
        [getOrderValue(state.sort)],
      ),
      totalHits: flatWorkflows.result.totalHits ?? 0,
    },
  };

  const workflowsAmount = hierarchy.count + flat.result.totalHits;

  return (
    <PageContainer>
      <ExecutedWorkflowBulkOperationsBlock
        workflowsAmount={workflowsAmount}
        selectedWorkflows={state.selectedWorkflows}
        selectAllWorkflows={selectAllWorkflows}
      />

      <ExecutedWorkflowSearchBox
        changeLabels={changeLabels}
        showFlat={state.isFlat}
        changeQuery={changeQuery}
        changeView={changeView}
        labels={state.labels}
        query={state.workflowId}
      />

      {!state.isFlat && (
        <ExecutedWorkflowHierarchicalTable
          selectAllWorkflows={selectAllWorkflows}
          sortWf={sortWf}
          indent={indent}
          hierarchicalWorkflows={hierarchy}
          onExecutedWorkflowClick={onWorkflowIdClick}
          openParentWfs={state.openParentWfs}
          selectWf={selectWf}
          selectedWfs={state.selectedWorkflows}
          showChildrenWorkflows={showChildrenWorkflows}
          sort={state.sort}
        />
      )}

      {state.isFlat && (
        <ExecutedWorkflowFlatTable
          selectAllWorkflows={selectAllWorkflows}
          sortWf={sortWf}
          onExecutedWorkflowClick={onWorkflowIdClick}
          selectWf={selectWf}
          selectedWfs={state.selectedWorkflows}
          sort={state.sort}
          flatWorkflows={flat}
        />
      )}
    </PageContainer>
  );
};

export default ExecutedWorkflowList;
