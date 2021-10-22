import './WorkflowExec.css';
import * as bulkActions from '../../../store/actions/bulk';
import * as searchActions from '../../../store/actions/search-execs';
import DetailsModal from './details-modal/details-modal';
import PageContainer from '../../../common/PageContainer';
import PageCount from '../../../common/PageCount';
import PageSelect from '../../../common/page-select';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import WorkflowBulk from './WorkflowBulk/workflow-bulk';
import { Box, Flex } from '@chakra-ui/react';
import { connect, RootStateOrAny } from 'react-redux';
import { ExecutedWorkflow, NestedExecutedWorkflow } from '../../../types/types';
import ExecutedWorkflowTable from './executed-workflow-table/executed-workflow-table';
import ExecutedWorkflowSearchBox from './executed-workflow-searchbox/executed-workflow-searchbox';

type Props = {
  query: string;
  onWorkflowIdClick: (wfId: string) => void;
};

type StateProps = {
  selectedWfs: string[];
  detailsModal: boolean;
  wfId: string;
  openParentWfs: NestedExecutedWorkflow[];
  closeDetails: boolean;
  showFlat: boolean;
  showChildren: NestedExecutedWorkflow[];
  defaultPages: number;
  pagesCount: number;
  viewedPage: number;
  datasetLength: number;
  timeout: NodeJS.Timeout;
  sort: number[];
};
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxStateProps = ReturnType<typeof mapStateToProps>;
type ComponentProps = Props & DispatchProps & ReduxStateProps;

const initialState = {
  query: '',
  selectedWfs: [],
  detailsModal: false,
  wfId: '',
  openParentWfs: [],
  closeDetails: true,
  showFlat: false,
  showChildren: [],
  defaultPages: 20,
  pagesCount: 1,
  viewedPage: 1,
  datasetLength: 0,
  timeout: setTimeout(() => {}, 0),
  sort: [2, 2, 2],
};

const ExecutedWorkflowList: FC<ComponentProps> = ({
  deleteParents,
  fetchNewData,
  checkedWorkflows,
  updateByQuery,
  updateByLabel,
  query,
  onWorkflowIdClick,
  fetchParentWorkflows,
  searchReducer,
  setView,
  updateParents,
  updateSize,
}) => {
  const [state, setState] = useState<StateProps>(initialState);

  useEffect(() => {
    setState((prev) => {
      return {
        ...prev,
        wfId: query,
        detailsModal: false,
        closeDetails: true,
      };
    });

    if (query) {
      updateByQuery(query);
    }

    const { data, query: searchQuery, parents, size } = searchReducer;
    const dataset = state.showFlat ? data : parents;
    if (dataset.length === 1 && searchQuery !== '' && !state.detailsModal && state.closeDetails && searchQuery) {
      showDetailsModal(searchQuery);
    }

    if (size !== state.datasetLength) {
      const pagesCount = size / state.defaultPages;
      setState((prev) => {
        return {
          ...prev,
          pagesCount: size % state.defaultPages ? pagesCount + 1 : pagesCount,
          datasetLength: size,
        };
      });
    }
    if (state.showFlat) {
      fetchNewData(state.wfId, state.viewedPage, state.defaultPages);
    } else {
      checkedWorkflows([0]);
      fetchParentWorkflows(state.wfId, state.viewedPage, state.defaultPages);
      update([], []);
    }
  }, [query, state.showFlat]);

  const clearView = () => {
    state.openParentWfs.forEach((parent) => showChildrenWorkflows(parent, null, null));
    updateByQuery('');
    updateByLabel([]);
    update([], []);
  };

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
    closeParentWfs: NestedExecutedWorkflow[] | null,
    closeChildWfs: NestedExecutedWorkflow[] | null,
  ) => {
    const childrenDataset: NestedExecutedWorkflow[] = searchReducer.children;
    if (childrenDataset.length) {
      childrenDataset.forEach((wf: any, index: number) => (wf.index = index));
    }

    let showChildren = closeChildWfs ? closeChildWfs : state.showChildren;
    let openParents = closeParentWfs ? closeParentWfs : state.openParentWfs;

    if (openParents.filter((wfs) => wfs.startTime === workflow.startTime).length) {
      const closeParents = openParents.filter((wf) => wf.parentWorkflowId === workflow.workflowId);
      deleteParents(showChildren.filter((wf) => wf.parentWorkflowId === workflow.workflowId));
      openParents = openParents.filter((wfs) => wfs.startTime !== workflow.startTime);
      showChildren = showChildren.filter((wf) => wf.parentWorkflowId !== workflow.workflowId);
      closeParents.length
        ? closeParents.forEach((open) => showChildrenWorkflows(open, openParents, showChildren))
        : update(openParents, showChildren);
    } else {
      openParents.push(workflow);
      showChildren = showChildren.concat(childrenDataset.filter((wf) => wf.parentWorkflowId === workflow.workflowId));
      updateParents(showChildren.filter((wf) => wf.parentWorkflowId === workflow.workflowId));
      update(openParents, showChildren);
    }
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

  const setCountPages = (defaultPages: number, pagesCount: number) => {
    if (state.showFlat) {
      fetchNewData(state.wfId, 1, defaultPages);
    } else {
      updateSize(1);
      checkedWorkflows([0]);
      fetchParentWorkflows(state.wfId, 1, defaultPages);
      state.openParentWfs.forEach((parent) => showChildrenWorkflows(parent, null, null));
      update([], []);
    }
    setState((prev) => {
      return {
        ...prev,

        defaultPages: defaultPages,
        pagesCount: pagesCount,
        viewedPage: 1,
      };
    });
  };

  const setViewPage = (page: number) => {
    if (state.showFlat) {
      fetchNewData(state.wfId, page, state.defaultPages);
    } else {
      fetchParentWorkflows(state.wfId, page, state.defaultPages);
      state.openParentWfs.forEach((parent) => showChildrenWorkflows(parent, null, null));
      update([], []);
    }
    setState((prev) => {
      return {
        ...prev,
        viewedPage: page,
        sort: [2, 2, 2],
      };
    });
  };

  const dynamicSort = (property: string) => {
    let sortOrder = true;
    if (property[0] === '-') {
      sortOrder = false;
      property = property.slice(1);
    }
    return (a: { [key: string]: any }, b: { [key: string]: any }) => {
      if (!a['parentWorkflowId'] && !b['parentWorkflowId']) {
        return !sortOrder ? b[property].localeCompare(a[property]) : a[property].localeCompare(b[property]);
      }
    };
  };

  const selectWfView = () => {
    clearView();
    updateSize(1);
    setState((prev) => {
      return {
        ...prev,
        showFlat: !state.showFlat,
        viewedPage: 1,
        sort: [2, 2, 2],
      };
    });
  };

  const selectWf = (e: ChangeEvent<HTMLInputElement>) => {
    const { data, parents } = searchReducer;
    const dataset = state.showFlat ? data : parents;
    const rowNum = e.target.id.split('-')[1];

    let wfIds = state.selectedWfs;
    const wfId: string = dataset[rowNum]['workflowId'];

    if (wfIds.includes(wfId)) {
      const idx = wfIds.indexOf(wfId);
      if (idx !== -1) {
        wfIds.splice(idx, 1);
      }
    } else {
      wfIds.push(wfId);
      if (!state.showFlat) {
        wfIds = selectChildrenWf(wfId, wfIds);
      }
    }
    setState((prev) => {
      return {
        ...prev,
        selectedWfs: wfIds,
      };
    });
  };

  const selectChildrenWf = (parentId: string, wfIds: string[]) => {
    const { children } = searchReducer;
    const newWfIds = children
      .filter((wf: NestedExecutedWorkflow) => wf.parentWorkflowId === parentId)
      .map((wf: NestedExecutedWorkflow) => wf.workflowId);
    for (let i = 0; i < newWfIds.length; i++) wfIds = wfIds.concat(selectChildrenWf(newWfIds[i], newWfIds));
    return [...new Set(wfIds)];
  };

  const selectAllWfs = () => {
    const { data, parents, children } = searchReducer;
    const hiddenChildren: NestedExecutedWorkflow[] = children.filter(
      (obj: NestedExecutedWorkflow) => !state.showChildren.some((obj2) => obj.startTime === obj2.startTime),
    );
    const dataset = state.showFlat ? data : parents.concat(hiddenChildren);
    const wfIds: string[] = [];

    if (state.selectedWfs.length > 0) {
      setState((prev) => ({ ...prev, selectedWfs: [] }));
    } else {
      dataset.map((entry: ExecutedWorkflow) => {
        if (!state.selectedWfs.includes(entry.workflowId)) {
          wfIds.push(entry.workflowId);
        }
        return null;
      });
      setState((prev) => ({ ...prev, selectedWfs: wfIds }));
    }
  };

  const showDetailsModal = (workflowId?: string) => {
    if (workflowId == null || workflowId.trim() === '') return;

    setState((prev) => {
      return {
        ...prev,
        wfId: workflowId,
        detailsModal: !state.detailsModal,
        closeDetails: !state.detailsModal,
      };
    });
  };

  const changeQuery = (e: string) => {
    updateByQuery(e);
    if (!state.showFlat) {
      state.openParentWfs.forEach((parent) => showChildrenWorkflows(parent, null, null));
      update([], []);
      updateSize(1);
      checkedWorkflows([0]);
    }
    if (state.timeout) clearTimeout(state.timeout);
    setState((prev) => {
      return {
        ...prev,
        timeout: setTimeout(() => {
          state.showFlat
            ? fetchNewData(state.wfId, 1, state.defaultPages)
            : fetchParentWorkflows(state.wfId, 1, state.defaultPages);
        }, 300),
        viewedPage: 1,
        sort: [2, 2, 2],
      };
    });
  };

  const changeLabels = (e: string[]) => {
    updateByLabel(e);
    if (state.showFlat) {
      fetchNewData(state.wfId, 1, state.defaultPages);
    } else {
      state.openParentWfs.forEach((parent) => showChildrenWorkflows(parent, null, null));
      update([], []);
      updateSize(1);
      checkedWorkflows([0]);
      fetchParentWorkflows(state.wfId, 1, state.defaultPages);
    }
    setState((prev) => ({
      ...prev,
      viewedPage: 1,
      sort: [2, 2, 2],
    }));
  };

  const sortWf = (number: number) => {
    const sort = state.sort;
    for (let i = 0; i < sort.length; i++) {
      i === number ? (sort[i] = sort[i] === 2 ? 0 : sort[i] === 0 ? 1 : 0) : (sort[i] = 2);
    }
    if (!state.showFlat) {
      state.openParentWfs.forEach((parent) => showChildrenWorkflows(parent, null, null));
      update([], []);
    }
    setState((prev) => ({
      ...prev,
      sort: sort,
    }));
  };

  const changeView = () => {
    setView(!state.showFlat);
    selectWfView();
  };

  const detailsModal = state.detailsModal ? (
    <DetailsModal
      wfId={state.wfId}
      modalHandler={showDetailsModal}
      refreshTable={() =>
        state.showFlat
          ? fetchNewData(state.wfId, 1, state.defaultPages)
          : fetchParentWorkflows(state.wfId, 1, state.defaultPages)
      }
      onWorkflowIdClick={onWorkflowIdClick}
    />
  ) : null;

  const wfsCount = state.showFlat ? searchReducer.data : searchReducer.parents;

  return (
    <PageContainer>
      {detailsModal}
      <WorkflowBulk
        wfsCount={wfsCount.length}
        selectedWfs={state.selectedWfs}
        pageCount={state.defaultPages}
        selectAllWfs={selectAllWfs}
        bulkOperation={clearView}
      />

      <ExecutedWorkflowSearchBox
        changeLabels={changeLabels}
        showFlat={state.showFlat}
        changeQuery={changeQuery}
        changeView={changeView}
        searchReducer={searchReducer}
      />

      <ExecutedWorkflowTable
        sort={state.sort}
        isLoading={true}
        showFlat={state.showFlat}
        dynamicSort={dynamicSort}
        indent={indent}
        showChildrenWorkflows={showChildrenWorkflows}
        showDetailsModal={showDetailsModal}
        openParentWfs={state.openParentWfs}
        searchReducer={searchReducer}
        selectWf={selectWf}
        selectedWfs={state.selectedWfs}
        showChildren={state.showChildren}
        sortWf={sortWf}
      />

      <Box marginTop={5}>
        <Flex justifyContent="space-between">
          <Box>
            <PageCount dataSize={searchReducer.size} defaultPages={state.defaultPages} handler={setCountPages} />
          </Box>
          <Box>
            <PageSelect viewedPage={state.viewedPage} count={state.pagesCount} indent={1} handler={setViewPage} />
          </Box>
        </Flex>
      </Box>
    </PageContainer>
  );
};

const mapStateToProps = (state: ReturnType<RootStateOrAny>) => {
  return {
    searchReducer: state.searchReducer,
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    updateByQuery: (query: string) => dispatch(searchActions.updateQuery(query)),
    updateByLabel: (label: string[]) => dispatch(searchActions.updateLabel(label)),
    fetchNewData: (wfName: string, viewedPage: number, defaultPages: number) =>
      dispatch(searchActions.fetchNewData(wfName, viewedPage, defaultPages)),
    fetchParentWorkflows: (wfName: string, viewedPage: number, defaultPages: number) =>
      dispatch(searchActions.fetchParentWorkflows(wfName, viewedPage, defaultPages)),
    updateParents: (children: NestedExecutedWorkflow[]) => dispatch(searchActions.updateParents(children)),
    deleteParents: (children: NestedExecutedWorkflow[]) => dispatch(searchActions.deleteParents(children)),
    updateSize: (size: number) => dispatch(searchActions.updateSize(size)),
    checkedWorkflows: (checkedWfs: number[]) => dispatch(searchActions.checkedWorkflows(checkedWfs)),
    setView: (value: unknown) => dispatch(bulkActions.setView(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExecutedWorkflowList);
