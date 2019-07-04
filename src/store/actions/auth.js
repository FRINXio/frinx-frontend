export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL  = "AUTH_FAIL";
export const SWITCH_AUTH = "SWITCH_AUTH";

const http = require('../../server/HttpServerSide').HttpClient;


export const authStart = () => {
    return {type: AUTH_START}
};

export const authSuccess = (authData) => {
    return {type: AUTH_SUCCESS, authData}
};

export const authFail = (error) => {
    return {type: AUTH_FAIL, error}
};

export const switchAuth = () => {
    return {type: SWITCH_AUTH}
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBjf7igOYiFFASYpYiNZgWQOPb96Epn1_A';
        if (!isSignup) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBjf7igOYiFFASYpYiNZgWQOPb96Epn1_A'
        }
        http.post(url, JSON.stringify(authData))
            .then(res => {
                dispatch(authSuccess(res.body))
            })
            .catch(err => {
                dispatch(authFail(err))
            })
    }
};


