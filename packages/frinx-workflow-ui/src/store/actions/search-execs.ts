import { isEmpty, sortBy } from 'lodash';
import { RootStateOrAny } from 'react-redux';
import { Dispatch, Store } from 'redux';
import { ExecutedWorkflow, ExecutedWorkflowsFlat, NestedExecutedWorkflow } from '../../types/types';
import callbackUtils from '../../utils/callback-utils';

export const RECEIVE_NEW_DATA = 'RECEIVE_NEW_DATA';
export const HIERARCHY_NEW_DATA = 'HIERARCHY_NEW_DATA';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const UPDATE_QUERY = 'UPDATE_QUERY';
export const DATA_SIZE = 'DATA_SIZE';
export const CHECKED_WORKFLOWS = 'CHECKED_WORKFLOWS';

export const updateSize = (size: number) => {
  return { type: DATA_SIZE, size };
};

export const updateLabel = (label: string[]) => {
  return { type: UPDATE_LABEL, label };
};

export const updateQuery = (query: string) => {
  return { type: UPDATE_QUERY, query };
};

export const fetchNewData = (workflowName: string, viewedPage: number, defaultPages: number) => {
  return (dispatch: Dispatch, getState: ReturnType<RootStateOrAny>) => {
    const { label } = getState().searchReducer;
    const page = (viewedPage - 1) * defaultPages;
    const getWorkflowExecutions = callbackUtils.getWorkflowExecutionsCallback();

    const wfLabel = !isEmpty(label) ? label : '';
    const wfName = !isEmpty(workflowName) ? workflowName : '';

    getWorkflowExecutions(wfName, wfLabel, page, defaultPages.toString()).then((res: ExecutedWorkflowsFlat) => {
      if (res.result) {
        const data = res.result ? (res.result.hits ? res.result.hits : []) : [];
        dispatch(updateSize(res.result.totalHits));
        dispatch(receiveNewData(data));
      }
    });
  };
};

export const receiveNewData = (data: ExecutedWorkflow[]) => {
  return { type: RECEIVE_NEW_DATA, data };
};

export const fetchParentWorkflows = (workflowName: string, viewedPage: number, defaultPages: number) => {
  return (dispatch: Dispatch, getState: ReturnType<RootStateOrAny>) => {
    const page = viewedPage - 1;

    const { checkedWfs, size, label } = getState().searchReducer;
    const getWorkflowExecutionsHierarchical = callbackUtils.getWorkflowExecutionsHierarchicalCallback();

    const wfLabel = !isEmpty(label) ? label : '';
    const wfName = !isEmpty(workflowName) ? workflowName : '';

    getWorkflowExecutionsHierarchical(wfName, wfLabel, checkedWfs[page], defaultPages.toString())
      .then((res) => {
        if (res) {
          const parents = res.parents ? res.parents : [];
          const children = res.children ? res.children : [];
          if (res.count < res.hits && (typeof checkedWfs[viewedPage] === 'undefined' || checkedWfs.length === 1)) {
            checkedWfs.push(res.count);
            dispatch(updateSize(size + parents.length));
          }
          dispatch(checkedWorkflows(checkedWfs));
          const sortedParents = sortBy(parents, (wf) => new Date(wf.startTime)).reverse();
          dispatch(receiveHierarchicalData(sortedParents, children));
        }
      })
      .catch((err) => console.log(err.message));
  };
};

export const receiveHierarchicalData = (parents: ExecutedWorkflow[], children: NestedExecutedWorkflow[]) => {
  return { type: HIERARCHY_NEW_DATA, parents, children };
};

export const checkedWorkflows = (checkedWfs: number[]) => {
  return { type: CHECKED_WORKFLOWS, checkedWfs };
};

export const updateParents = (childInput: NestedExecutedWorkflow[]) => {
  return (dispatch: Dispatch, getState: ReturnType<RootStateOrAny>) => {
    const { parents, children } = getState().searchReducer;
    let dataset: ExecutedWorkflow[] = parents;
    dataset.forEach((wfs: ExecutedWorkflow, i: number) => {
      if (childInput.some((e) => e.parentWorkflowId === wfs.workflowId)) {
        let unfoldChildren = childInput.filter((wf) => wf.parentWorkflowId === wfs['workflowId']);
        unfoldChildren = sortBy(unfoldChildren, (wf) => new Date(wf.startTime));
        unfoldChildren.forEach((wf, index) => dataset.splice(index + 1 + i, 0, wf));
      }
    });
    dispatch(receiveHierarchicalData(dataset, children));
  };
};

export const deleteParents = (childInput: NestedExecutedWorkflow[]) => {
  return (dispatch: Dispatch, getState: ReturnType<RootStateOrAny>) => {
    const { parents, children } = getState().searchReducer;
    let dataset: ExecutedWorkflow[] = parents;
    childInput.forEach((wfs) => {
      dataset = dataset.filter((p) => p.workflowId !== wfs.workflowId);
    });
    dispatch(receiveHierarchicalData(dataset, children));
  };
};
