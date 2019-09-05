import {sortBy} from "lodash";

export const RECEIVE_NEW_DATA = "RECEIVE_NEW_DATA";
export const HIERARCHY_NEW_DATA = "HIERARCHY_NEW_DATA";
export const UPDATE_LABEL = "UPDATE_LABEL";
export const UPDATE_QUERY = "UPDATE_QUERY";
export const DATA_SIZE = "DATA_SIZE";
export const CHECKED_WORKFLOWS = "CHECKED_WORKFLOWS";

const http = require('../../server/HttpServerSide').HttpClient;

export const updateSize = (size) => {
    return {type: DATA_SIZE, size}
};

export const updateLabel = (label) => {
    return {type: UPDATE_LABEL, label}
};

export const updateQuery = (query) => {
    return {type: UPDATE_QUERY, query}
};

export const fetchNewData = (viewedPage, defaultPages) => {
    return (dispatch, getState) => {
        const {label, query} = getState().searchReducer;
        let q = "";
        if (query)
            q += "(workflowId:" + query + "+workflowType:*" + query + "*)";
        if (label.length ) {
            if (query)
                q += "AND";
            q += "(status:" + label + ")";
        }
        let page = (viewedPage - 1) * defaultPages;
        http.get('/api/conductor/executions/?q=&h=&freeText='+ q +'&start='+ page +'&size=' + defaultPages).then(res => {
            if (res.result.totalHits)
                dispatch(updateSize(res.result.totalHits));
            const data = res.result ? (res.result.hits ? res.result.hits : []) : [];
            dispatch(receiveNewData(data));
        });
    }
};

export const receiveNewData = (data) => {
    return {type: RECEIVE_NEW_DATA, data}
};

export const fetchParentWorkflows = (viewedPage, defaultPages) => {
    return (dispatch, getState) => {
        let page = (viewedPage - 1);

        const {label, query, checkedWfs, size} = getState().searchReducer;
        let q = "";
        if (query)
            q += "(workflowId:" + query + "+workflowType:*" + query + "*)";
        if (label.length ) {
            if (query)
                q += "AND";
            q += "(status:" + label + ")";
        }
        http.get('/api/conductor/hierarchical/?freeText='+ q +'&start=' + checkedWfs[page] + '&size=' + defaultPages).then(res => {
            let parents = res.parents ? res.parents : [];
            let children = res.children ? res.children : [];
            if ((res.count < res.hits) && (typeof checkedWfs[viewedPage] === "undefined" || checkedWfs.length === 1)) {
                checkedWfs.push(res.count);
                dispatch(updateSize(size + parents.length));
            }
            dispatch(checkedWorkflows(checkedWfs));
            parents = sortBy(parents, wf => new Date(wf.startTime)).reverse();
            dispatch(receiveHierarchicalData(parents, children));
        });
    }
};

export const receiveHierarchicalData = (parents, children) => {
    return {type: HIERARCHY_NEW_DATA, parents, children}
};

export const checkedWorkflows = (checkedWfs) => {
    return {type: CHECKED_WORKFLOWS, checkedWfs}
};

export const updateParents = (child) => {
    return (dispatch, getState) => {
        let {parents, children} = getState().searchReducer;
        let dataset = parents;
        dataset.forEach((wfs, i) => {
            if (child.some(e => e.parentWorkflowId === wfs.workflowId)) {
                let unfoldChildren = child.filter(wf => wf.parentWorkflowId === wfs["workflowId"]);
                unfoldChildren = sortBy(unfoldChildren, wf => new Date(wf.startTime));
                unfoldChildren.forEach((wf, index) => dataset.splice(index + 1 + i, 0, wf));
            }
        });
        if (dataset.length)
            dispatch(updateSize(dataset.length));
        dispatch(receiveHierarchicalData(dataset, children));
    }
};

export const deleteParents = (childs) => {
    return (dispatch, getState) => {
        let {parents, children} = getState().searchReducer;
        let dataset = parents ;
        childs.forEach(wfs  => {
            dataset = dataset.filter(p => p.workflowId !== wfs.workflowId);
        });
        if (dataset.length)
            dispatch(updateSize(dataset.length));
        dispatch(receiveHierarchicalData(dataset, children));
    }
};