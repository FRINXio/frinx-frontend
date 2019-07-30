import {
    UPDATE_SEARCH_RESULTS,
    RECEIVE_NEW_DATA,
    HIERARCHY_NEW_DATA,
    UPDATE_QUERY,
    UPDATE_LABEL,
    UPDATE_HIERARCHY_RESULTS
} from '../actions/searchExecs';

const initialState = {
    isFetching: false,
    data: [],
    table: [],
    query: "",
    label: [],
    parents: [],
    child: [],
    parentsTable: [],
    childTable: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LABEL: {
            let {label} = action;
            label = label ? label : [];
            return {...state, label}
        }
        case UPDATE_QUERY: {
            const {query} = action;
            return {...state, query}
        }
        case RECEIVE_NEW_DATA: {
            const {data, table} = action;
            return {...state, isFetching: false, data, table}
        }
        case HIERARCHY_NEW_DATA: {
            const {parents, child, parentsTable, childTable} = action;
            return {...state, isFetching: false, parents, child, parentsTable, childTable}
        }
        case UPDATE_SEARCH_RESULTS: {
            const {table} = action;
            return {...state, table}
        }
        case UPDATE_HIERARCHY_RESULTS: {
            const {parentsTable, childTable} = action;
            return {...state, parentsTable, childTable}
        }
        default: break;
    }
    return state;
};

export default reducer;
