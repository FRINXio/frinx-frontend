export const RECEIVE_NEW_DATA = "RECEIVE_NEW_DATA";
export const UPDATE_SEARCH_RESULTS = "UPDATE_SEARCH_RESULTS";
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

export const fetchParentWorkflows = () => {
    return (dispatch, getState) => {
        http.get('/api/conductor/workflow/tasks').then(res => {
            let allData = res.result ? (res.result.results ? res.result.results : []) : [];
            const table = res.result ? (res.result.results ? res.result.results : []) : [];
            const data = allData.filter(wfs => wfs.taskType === 'SUB_WORKFLOW');
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
