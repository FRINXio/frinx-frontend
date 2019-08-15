import {sortBy} from "lodash";

export const RECEIVE_NEW_DATA = "RECEIVE_NEW_DATA";
export const HIERARCHY_NEW_DATA = "HIERARCHY_NEW_DATA";
export const UPDATE_SEARCH_RESULTS = "UPDATE_SEARCH_RESULTS";
export const UPDATE_HIERARCHY_RESULTS = "UPDATE_HIERARCHY_RESULTS";
export const UPDATE_LABEL = "UPDATE_LABEL";
export const UPDATE_QUERY = "UPDATE_QUERY";

const http = require('../../server/HttpServerSide').HttpClient;

export const updateLabel = (label) => {
    return {type: UPDATE_LABEL, label}
};

export const updateQuery = (query) => {
    return {type: UPDATE_QUERY, query}
};

export const fetchNewData = () => {
    return (dispatch, getState) => {
        http.get('/api/conductor/executions/?q=&h=&freeText=&start=0').then(res => {
            const data = res.result ? (res.result.hits ? res.result.hits : []) : [];
            const table = res.result ? (res.result.hits ? res.result.hits : []) : [];
            const {label, query} = getState().searchReducer;
            dispatch(receiveNewData(data, table));
            if (label.length || query.length) {
                dispatch(updateByLabel(label));
                dispatch(updateByQuery(query));
            }
        });
    }
};

export const receiveNewData = (data, table) => {
    return {type: RECEIVE_NEW_DATA, data, table}
};

export const updateByLabel = (label) => {
    return (dispatch, getState) => {
        dispatch(updateLabel(label));
        let {data, table, query} = getState().searchReducer;
        let toBeUpdated = [];

        if (label !== undefined) {
            const rows = (table.length && query !== "") ? table : data;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]["status"] === label) {
                    toBeUpdated.push(rows[i]);
                }
            }
        } else {
            dispatch(updateByQuery(query));
            return;
        }
        dispatch(updateSearchResults(toBeUpdated))
    }
};

export const updateByQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(updateQuery(query));
        let {data, table, label} = getState().searchReducer;
        let toBeUpdated = [];
        let finalUpdated = [];
        query = query.toUpperCase();

        if (query !== "") {
            const rows = (table.length && label.length) ? table : data;
            for (let i = 0; i < rows.length; i++) {
                if ((rows[i]["workflowType"] && rows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1)
                    || rows[i]["workflowId"].toUpperCase() === query) {
                    toBeUpdated.push(rows[i]);
                }
            }
            if (label.length) {
                toBeUpdated.forEach(workflow => {
                    if (workflow["status"] === label)
                        finalUpdated.push(workflow);
                });
            } else {
                finalUpdated = toBeUpdated;
            }
        } else {
            dispatch(updateByLabel(label));
            return;
        }
        dispatch(updateSearchResults(finalUpdated))
    }
};

export const updateSearchResults = (table) => {
    return {type: UPDATE_SEARCH_RESULTS, table}
};

export const fetchParentWorkflows = () => {
    return (dispatch, getState) => {
        http.get('/api/conductor/executions/?q=&h=&freeText=&start=0').then(res => {
            let allData = res.result ? (res.result.hits ? res.result.hits : []) : [];
            let parents = []; let child = [];
            let separatedWfs = [];
            let chunk = 5;
            for (let i = 0,j = allData.length; i < j; i +=chunk) {
                separatedWfs.push(allData.slice(i,i + chunk));
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
                        parents = sortBy(parents, wf => new Date (wf.startTime)).reverse();
                        dispatch(receiveParentData(parents, child, parents, child));
                    }
                })
                : dispatch(receiveParentData(parents, child, parents, child));
            const {label, query} = getState().searchReducer;
            if (label.length || query !== "") {
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
            const childRows = (childTable.length && query !== "") ? childTable : child;
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
            const parentRows = (parentsTable.length && query !== "") ? parentsTable : parents;
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
        let finalParentsUpdated = [];
        query = query.toUpperCase();

        if (query !== "") {
            const childRows = (childTable.length && label.length) ? childTable : child;
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
            const parentRows = (parentsTable.length && query !== "") ? parentsTable : parents;
            for (let i = 0; i < parentRows.length; i++) {
                if ((parentRows[i]["workflowType"] && parentRows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1)
                    || parentRows[i]["workflowId"].toUpperCase() === query
                    || updatedChild.find(wf => wf.parentWorkflowId === parentRows[i]["workflowId"])) {
                    updatedParents.push(parentRows[i]);
                }
            }
            if (label.length) {
                updatedParents.forEach(workflow => {
                    if (workflow["status"] === label)
                        finalParentsUpdated.push(workflow);
                });
            } else {
                finalParentsUpdated = updatedParents;
            }
        } else {
            dispatch(updateHierarchicalDataByLabel(label));
            return;
        }
        dispatch(updateHierarchicalResults(finalParentsUpdated, updatedChild));
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
        (query === "" && label < 1)
            ? dispatch(receiveParentData(dataset, child, parents, child))
            : dispatch(receiveParentData(parents, child, dataset, childTable));
    }
};