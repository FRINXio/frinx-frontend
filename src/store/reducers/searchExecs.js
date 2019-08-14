import {
    RECEIVE_NEW_DATA,
    HIERARCHY_NEW_DATA,
    UPDATE_QUERY,
    UPDATE_LABEL,
    UPDATE_HIERARCHY_RESULTS,
    DATA_SIZE
} from '../actions/searchExecs';

const initialState = {
    isFetching: false,
    data: [],
    query: "",
    label: [],
    parents: [],
    child: [],
    parentsTable: [],
    childTable: [],
    size: 0
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
            const {data} = action;
            return {...state, isFetching: false, data}
        }
        case HIERARCHY_NEW_DATA: {
            const {parents, child, parentsTable, childTable} = action;
            return {...state, isFetching: false, parents, child, parentsTable, childTable}
        }
        case UPDATE_HIERARCHY_RESULTS: {
            const {parentsTable, childTable} = action;
            return {...state, parentsTable, childTable}
        }
        case DATA_SIZE: {
            const {size} = action;
            return {...state, size}
        }
        default: break;
    }
    return state;
};

export default reducer;
