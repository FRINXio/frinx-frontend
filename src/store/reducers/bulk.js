import {
    REQUEST_BULK_OPERATION,
    RECEIVE_BULK_OPERATION_RESPONSE,
    FAIL_BULK_OPERATION,
    RESET_BULK_OPERATION_RESULT
} from '../actions/bulk';

const initialState = {
    isFetching: false,
    error: null,
    successfulResults: [],
    errorResults: {},
    data: [],
    table: [],
    query: "",
    label: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_BULK_OPERATION: {
            return {...state, isFetching: true, error: null};
        }
        case RECEIVE_BULK_OPERATION_RESPONSE: {
            const {successfulResults = [], errorResults = {}} = action;

            return {...state, isFetching: false, error: null, successfulResults, errorResults};
        }
        case FAIL_BULK_OPERATION: {
            const {error} = action;

            return {...state, isFetching: false, error};
        }
        case RESET_BULK_OPERATION_RESULT: {
            return {...state, successfulResults: [], errorResults: []};
        }
        default: break;
    }
    return state;
};

export default reducer;
