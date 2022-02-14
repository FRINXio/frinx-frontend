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
import ExecutedWorkflowBulkOperationsBlock from './executed-workflow-bulk-operations-block/executed-workflow-bulk-operations';
import Paginator from '../../../common/pagination';
import { usePagination } from '../../../common/pagination-hook';

type Props = {
  onWorkflowIdClick: (workflowId: string) => void;
};

type StateProps = {
  selectedWorkflows: string[];
  detailsModal: boolean;
  workflowId: string;
  openParentWorkflows: NestedExecutedWorkflow[];
  isFlat: boolean;
  showChildren: NestedExecutedWorkflow[];
  sort: number[];
  labels: string[];
};
const ITEMS_PER_PAGE = 20;

const initialState = {
  selectedWorkflows: [],
  detailsModal: false,
  workflowId: '',
  openParentWorkflows: [],
  isFlat: false,
  showChildren: [],
  sort: [/*workflowId*/ 2, /*startTime*/ 0, /*endTime*/ 2],
  labels: [],
};

const ExecutedWorkflowList: FC<Props> = ({ onWorkflowIdClick }) => {
  const [state, setState] = useState<StateProps>(initialState);
  const [flatWorkflows, setFlatWorkflows] = useState<ExecutedWorkflowsFlat | null>(null);
  const [hierarchicalWorkflows, setHierarchicalWorkflows] = useState<ExecutedWorkflowsHierarchical | null>(null);
  const hierarchicalPagination = usePagination([], ITEMS_PER_PAGE);
  const flatViewPagination = usePagination([], ITEMS_PER_PAGE);

  useEffect(() => {
    fetchNewData(
      state.workflowId,
      flatViewPagination.currentPage,
      flatViewPagination.maxItemsPerPage,
      state.labels,
    ).then((response) => {
      setFlatWorkflows(response);
    });
    fetchParentWorkflows(
      state.workflowId,
      hierarchicalPagination.currentPage,
      hierarchicalPagination.maxItemsPerPage,
      state.labels,
    ).then((response) => {
      setHierarchicalWorkflows(response);
    });
  }, [
    state,
    hierarchicalPagination.currentPage,
    hierarchicalPagination.maxItemsPerPage,
    flatViewPagination.currentPage,
    flatViewPagination.maxItemsPerPage,
  ]);

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
        openParentWorkflows: openParents,
        showChildren,
      };
    });
  };

  const showChildrenWorkflows = (
    workflow: NestedExecutedWorkflow,
    children: NestedExecutedWorkflow[],
    closeParentWorkflows: NestedExecutedWorkflow[] | null,
    closeChildWorkflows: NestedExecutedWorkflow[] | null,
  ) => {
    let showChildren = closeChildWorkflows ? closeChildWorkflows : state.showChildren;
    let openParents = closeParentWorkflows ? closeParentWorkflows : state.openParentWorkflows;

    if (openParents.filter((Workflows) => Workflows.startTime === workflow.startTime).length) {
      const closeParents = openParents.filter((workflow) => workflow.parentWorkflowId === workflow.workflowId);
      openParents = openParents.filter((Workflows) => Workflows.startTime !== workflow.startTime);
      showChildren = showChildren.filter((workflow) => workflow.parentWorkflowId !== workflow.workflowId);
      closeParents.length
        ? closeParents.forEach((open) => showChildrenWorkflows(open, children, openParents, showChildren))
        : update(openParents, showChildren);
    } else {
      openParents.push(workflow);
      showChildren = showChildren.concat(
        children.filter((workflow) => workflow.parentWorkflowId === workflow.workflowId),
      );
      update(openParents, showChildren);
    }
  };

  const changeLabels = (labels: string[]) => {
    setState((prev) => ({ ...prev, labels }));
    hierarchicalPagination.setCurrentPage(1);
    flatViewPagination.setCurrentPage(1);
  };

  const changeQuery = (query: string) => {
    setState((prev) => ({ ...prev, workflowId: query }));
    hierarchicalPagination.setCurrentPage(1);
    flatViewPagination.setCurrentPage(1);
  };

  const indent = (workflows: NestedExecutedWorkflow[], i: number, size?: number) => {
    const indentSize = size ? size : 6;
    if ('parentWorkflowId' in workflows[i]) {
      let layers = 0;
      if (state.showChildren.some((child) => child.workflowId === workflows[i].parentWorkflowId)) {
        let parent = workflows[i];
        while (parent.parentWorkflowId) {
          layers++;
          parent = workflows[workflows.findIndex((id) => id.workflowId === parent.parentWorkflowId)];
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

  const selectWorkflow = (workflowId: string, isChecked: boolean) => {
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
          selectedWorkflows = new Set(hierarchicalWorkflows.parents.map((workflow) => workflow.workflowId));
        }

        return { ...prev, selectedWorkflows: [...selectedWorkflows] };
      });
    } else {
      setState((prev) => ({ ...prev, selectedWorkflows: [] }));
    }
  };

  const selectChildrenworkflow = (parentId: string, workflowIds: string[]) => {
    const { children } = hierarchicalWorkflows;
    const newWorkflowIds = children
      .filter((workflow: NestedExecutedWorkflow) => workflow.parentWorkflowId === parentId)
      .map((workflow: NestedExecutedWorkflow) => workflow.workflowId);
    for (let i = 0; i < newWorkflowIds.length; i++)
      workflowIds = workflowIds.concat(selectChildrenworkflow(newWorkflowIds[i], newWorkflowIds));
    return [...new Set(workflowIds)];
  };

  const sortWorkflow = (sortId: number) => {
    const sort = state.sort.map((value, i) => (sortId === i ? getSortValue(value) : 2));
    if (!state.isFlat) {
      state.openParentWorkflows.forEach((parent) =>
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

  const handlePaginationClick = (pageNumber: number) => {
    if (state.isFlat) {
      flatViewPagination.setCurrentPage(pageNumber);
    } else {
      hierarchicalPagination.setCurrentPage(pageNumber);
    }
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

  const workflowsAmount = state.isFlat ? flat.result.totalHits : hierarchy.parents.length;

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
        <>
          <ExecutedWorkflowHierarchicalTable
            selectAllWorkflows={selectAllWorkflows}
            sortWf={sortWorkflow}
            indent={indent}
            hierarchicalWorkflows={hierarchy}
            onExecutedWorkflowClick={onWorkflowIdClick}
            openParentWfs={state.openParentWorkflows}
            selectWf={selectWorkflow}
            selectedWfs={state.selectedWorkflows}
            showChildrenWorkflows={showChildrenWorkflows}
            sort={state.sort}
          />

          <Paginator
            currentPage={hierarchicalPagination.currentPage}
            onPaginationClick={handlePaginationClick}
            pagesCount={Math.ceil(hierarchy.hits / ITEMS_PER_PAGE)}
            showPageNumbers={false}
          />
        </>
      )}

      {state.isFlat && (
        <>
          <ExecutedWorkflowFlatTable
            selectAllWorkflows={selectAllWorkflows}
            sortWf={sortWorkflow}
            onExecutedWorkflowClick={onWorkflowIdClick}
            selectWf={selectWorkflow}
            selectedWfs={state.selectedWorkflows}
            sort={state.sort}
            flatWorkflows={flat}
          />

          <Paginator
            currentPage={flatViewPagination.currentPage}
            onPaginationClick={handlePaginationClick}
            pagesCount={Math.ceil(workflowsAmount / ITEMS_PER_PAGE)}
            showPageNumbers={false}
          />
        </>
      )}
    </PageContainer>
  );
};

export default ExecutedWorkflowList;
