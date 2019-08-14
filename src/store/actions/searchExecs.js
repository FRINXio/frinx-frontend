import {sortBy} from "lodash";

export const RECEIVE_NEW_DATA = "RECEIVE_NEW_DATA";
export const HIERARCHY_NEW_DATA = "HIERARCHY_NEW_DATA";
export const UPDATE_HIERARCHY_RESULTS = "UPDATE_HIERARCHY_RESULTS";
export const UPDATE_LABEL = "UPDATE_LABEL";
export const UPDATE_QUERY = "UPDATE_QUERY";
export const DATA_SIZE = "DATA_SIZE";

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
            q += "workflowId:"+query+"+workflowType:*"+query+"*";
        if (label.length)
            q += " status:"+label;
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
        let page = (viewedPage - 1) * defaultPages;
        http.get('/api/conductor/executions/?q=&h=&freeText=&start=0&size=').then(res => {
            let allData = res.result ? (res.result.hits ? res.result.hits : []) : [];

            let parents = []; let child = [];
            let separatedWfs = [];
            let chunk = 5;
            for (let i = 0,j = allData.length; i < j; i +=chunk) {
                separatedWfs.push(allData.slice(i, i + chunk));
            }
            separatedWfs.length
                ? separatedWfs.forEach( async wfsChunk => {
                    let wfs = async function (sepWfs) {
                        return await Promise.all(
                            sepWfs.map(wf => http.get('/api/conductor/id/' + wf.workflowId))
                        );
                    };
                    let responses = await wfs(wfsChunk);
                    for (let i = 0; i < responses.length; i++) {
                        if (responses[i].result.parentWorkflowId) {
                            wfsChunk[i]["parentWorkflowId"] = responses[i].result.parentWorkflowId;
                            child.push(wfsChunk[i]);
                        } else {
                            parents.push(wfsChunk[i]);
                        }
                        if (parents.length)
                            dispatch(updateSize(parents.length));
                        parents = sortBy(parents, wf => new Date (wf.startTime)).reverse();
                        dispatch(receiveParentData(parents, child, [], []));
                    }
                })
                : dispatch(receiveParentData(parents, child, parents, child));
            const {label, query} = getState().searchReducer;
            if (label.length > 0 || query !== "") {
                dispatch(updateHierarchicalDataByLabel(label));
                dispatch(updateHierarchicalDataByQuery(query));
            }
        });
    }
};

export const receiveParentData = (parents, child, parentsTable, childTable) => {
    return {type: HIERARCHY_NEW_DATA, parents, child, parentsTable, childTable}
};

export const updateHierarchicalDataByLabel = (label) => {
    return (dispatch, getState) => {
        dispatch(updateLabel(label));
        let {parents, parentsTable, child, childTable, query} = getState().searchReducer;
        let updatedParents = [];
        let updatedChild = [];

        if (label !== undefined) {
            const childRows = (childTable.length > 0 && query !== "") ? childTable : child;
            for (let i = 0; i < childRows.length; i++) {
                if (childRows[i]["status"] === label) {
                    updatedChild.push(childRows[i]);
                    let parent = childRows.find(wf => wf.workflowId === childRows[i]["parentWorkflowId"]);
                    if (parent && !updatedChild.find(wf => wf.startTime === parent.startTime)) {
                        updatedChild.push(parent);
                    }
                }
            }
            updatedChild = [...new Set(updatedChild)];
            const parentRows = (parentsTable.length > 0 && query !== "") ? parentsTable : parents;
            for (let i = 0; i < parentRows.length; i++) {
                if (parentRows[i]["status"] === label
                    || updatedChild.find(wf => wf.parentWorkflowId === parentRows[i]["workflowId"])) {
                    updatedParents.push(parentRows[i]);
                }
            }
        } else {
            dispatch(updateHierarchicalDataByQuery(query));
            return;
        }
        dispatch(updateHierarchicalResults(updatedParents, updatedChild));
    }
};

export const updateHierarchicalDataByQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(updateQuery(query));
        let {parents, parentsTable, child, childTable, label} = getState().searchReducer;
        let updatedParents = [];
        let updatedChild = [];
        query = query.toUpperCase();

        if (query !== "") {
            const childRows = (childTable.length > 0 && label.length > 0) ? childTable : child;
            for (let i = 0; i < childRows.length; i++) {
                if ((childRows[i]["workflowType"] && childRows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1)
                    || childRows[i]["workflowId"].toUpperCase() === query) {
                    updatedChild.push(childRows[i]);
                    let parent = childRows.find(wf => wf.workflowId === childRows[i]["parentWorkflowId"]);
                    if (parent && !updatedChild.find(wf => wf.startTime === parent.startTime)) {
                        updatedChild.push(parent);
                    }
                }
            }
            updatedChild = [...new Set(updatedChild)];
            const parentRows = (parentsTable.length > 0 && query !== "") ? parentsTable : parents;
            for (let i = 0; i < parentRows.length; i++) {
                if ((parentRows[i]["workflowType"] && parentRows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1)
                    || parentRows[i]["workflowId"].toUpperCase() === query
                    || updatedChild.find(wf => wf.parentWorkflowId === parentRows[i]["workflowId"])) {
                    updatedParents.push(parentRows[i]);
                }
            }
        } else {
            dispatch(updateHierarchicalDataByLabel(label));
            return;
        }
        dispatch(updateHierarchicalResults(updatedParents, updatedChild));
    }
};

export const updateHierarchicalResults = (parentsTable, childTable) => {
    return {type: UPDATE_HIERARCHY_RESULTS, parentsTable, childTable}
};

export const updateParents = (children) => {
    return (dispatch, getState) => {
        let {query, label, parents, child, parentsTable, childTable} = getState().searchReducer;
        let dataset = (query === "" && label < 1) ? parents : parentsTable;
        dataset.forEach((wfs, i) => {
            if (children.some(e => e.parentWorkflowId === wfs.workflowId)) {
                let unfoldChildren = children.filter(wf => wf.parentWorkflowId === wfs["workflowId"]);
                unfoldChildren = sortBy(unfoldChildren, wf => new Date (wf.startTime));
                unfoldChildren.forEach((wf, index) => dataset.splice(index + 1 + i, 0, wf));
            }
        });
        if (dataset.length)
            dispatch(updateSize(dataset.length));
        (query === "" && label < 1)
            ? dispatch(receiveParentData(dataset, child, parents, child))
            : dispatch(receiveParentData(parents, child, dataset, childTable));
    }
};

export const deleteParents = (children) => {
    return (dispatch, getState) => {
        let {query, label, parents, child, parentsTable, childTable} = getState().searchReducer;
        let dataset = (query === "" && label < 1) ? parents : parentsTable;
        children.forEach(wfs  => {
            dataset = dataset.filter(p => p.workflowId !== wfs.workflowId);
        });
        if (dataset.length)
            dispatch(updateSize(dataset.length));
        (query === "" && label < 1)
            ? dispatch(receiveParentData(dataset, child, parents, child))
            : dispatch(receiveParentData(parents, child, dataset, childTable));
    }
};