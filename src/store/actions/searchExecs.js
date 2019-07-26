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
            if (label.length > 0 || query !== "") {
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
            const rows = (table.length > 0 && query !== "") ? table : data;
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
        query = query.toUpperCase();

        if (query !== "") {
            const rows = (table.length > 0 && label.length > 0) ? table : data;
            for (let i = 0; i < rows.length; i++) {
                if ((rows[i]["workflowType"] && rows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1)
                    || rows[i]["workflowId"].toUpperCase() === query) {
                    toBeUpdated.push(rows[i]);
                }
            }
        } else {
            dispatch(updateByLabel(label));
            return;
        }
        dispatch(updateSearchResults(toBeUpdated))
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
            separatedWfs.forEach( async wfsChunk => {
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
                    dispatch(receiveParentData(parents, child, parents, child));
                }
            });
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
            const parentsrows = (parentsTable.length > 0 && query !== "") ? parentsTable : parents;
            for (let i = 0; i < parentsrows.length; i++) {
                if (parentsrows[i]["status"] === label) {
                    updatedParents.push(parentsrows[i]);
                }
            }
            const childrows = (childTable.length > 0 && query !== "") ? childTable : child;
            for (let i = 0; i < childrows.length; i++) {
                if (childrows[i]["status"] === label) {
                    updatedChild.push(childrows[i]);
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
            const parentsrows = (parentsTable.length > 0 && label.length > 0) ? parentsTable : parents;
            for (let i = 0; i < parentsrows.length; i++) {
                if ((parentsrows[i]["workflowType"] && parentsrows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1)
                    || parentsrows[i]["workflowId"].toUpperCase() === query) {
                    updatedParents.push(parentsrows[i]);
                }
            }
            const childrows = (childTable.length > 0 && label.length > 0) ? childTable : child;
            for (let i = 0; i < childrows.length; i++) {
                if ((childrows[i]["workflowType"] && childrows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1)
                    || childrows[i]["workflowId"].toUpperCase() === query) {
                    updatedChild.push(childrows[i]);
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

//TODO add logic for labels and querry
export const updateParents = (children) => {
    return (dispatch, getState) => {
        let {parents, child} = getState().searchReducer;
        parents.forEach((wfs, i) => {
            if (children.some(e => e.parentWorkflowId === wfs.workflowId)) {
                let showchildren = children.filter(wf => wf.parentWorkflowId === wfs["workflowId"]);
                showchildren.forEach((wf, index) => parents.splice(index + 1 + i, 0, wf));
            }
        });
        dispatch(receiveParentData(parents, child, parents, child));
    }
};

export const deleteParents = (children) => {
    return (dispatch, getState) => {
        let {parents, child} = getState().searchReducer;
        children.forEach(wfs  => {
            parents = parents.filter(p => p.workflowId !== wfs.workflowId);
        });
        dispatch(receiveParentData(parents, child, parents, child));
    }
};