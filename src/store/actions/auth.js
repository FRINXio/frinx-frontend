export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const SWITCH_AUTH = "SWITCH_AUTH";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

const http = require("../../server/HttpServerSide").HttpClient;

export const authStart = () => {
  return { type: AUTH_START };
};

export const authSuccess = authData => {
  return {
    type: AUTH_SUCCESS,
    token: authData.idToken,
    userId: authData.localId,
    email: authData.email
  };
};

export const authFail = error => {
  return { type: AUTH_FAIL, error };
};

export const switchAuth = () => {
  return { type: SWITCH_AUTH };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, 24 * expirationTime * 1000);
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userEmail");
  return { type: AUTH_LOGOUT };
};

export const authCheckState = () => {
  return dispatch => {
    const idToken = localStorage.getItem("token");
    if (!idToken) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const localId = localStorage.getItem("userId");
        const email = localStorage.getItem("userEmail");
        dispatch(authSuccess({ idToken, localId, email }));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBjf7igOYiFFASYpYiNZgWQOPb96Epn1_A";
    if (!isSignup) {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBjf7igOYiFFASYpYiNZgWQOPb96Epn1_A";
    }
    http
      .post(url, JSON.stringify(authData))
      .then(res => {
        console.log(res);
        const expirationDate = new Date(
          new Date().getTime() + res.body.expiresIn * 1000
        );
        localStorage.setItem("token", res.body.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("userEmail", res.body.email);
        dispatch(authSuccess(res.body));
        dispatch(checkAuthTimeout(res.body.expiresIn));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};
