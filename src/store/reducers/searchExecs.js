import {
    UPDATE_SEARCH_RESULTS,
    RECEIVE_NEW_DATA,
    UPDATE_QUERY,
    UPDATE_LABEL
} from '../actions/searchExecs';

const initialState = {
    isFetching: false,
    data: [],
    table: [],
    query: "",
    label: []
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
        case UPDATE_SEARCH_RESULTS: {
            const {table} = action;
            return {...state, table}
        }
        default: break;
    }
    return state;
};

export default reducer;
