
import {AUTH_FAIL, AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS, SWITCH_AUTH} from "../actions/auth";

const initialState = {
    error: null,
    loading: false,
    userId: null,
    token: null,
    email: null
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
            const {userId, token, email} = action;
            return {...state, userId, token, email, error: null, loading: false};
        }
        case SWITCH_AUTH: {
            return {...state, error: null}
        }
        case AUTH_LOGOUT: {
            return {...state, error: null, token: null, userId: null }
        }
        default: break;
    }
    return state;
};

export default reducer;
