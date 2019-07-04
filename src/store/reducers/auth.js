
import {AUTH_FAIL, AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS, SWITCH_AUTH} from "../actions/auth";

const initialState = {
    error: null,
    loading: false,
    authData: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_START: {
            return {...state, error: null, loading: true};
        }
        case AUTH_FAIL: {
            const {error} = action;
            return {...state, error, loading: false};
        }
        case AUTH_SUCCESS: {
            const {authData} = action;
            return {...state, authData, error: null, loading: false};
        }
        case SWITCH_AUTH: {
            return {...state, error: null}
        }
        case AUTH_LOGOUT: {
            return {...state, error: null, authData: {} }
        }
        default: break;
    }
    return state;
};

export default reducer;
