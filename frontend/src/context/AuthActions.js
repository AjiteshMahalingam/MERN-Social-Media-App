import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS } from "./AuthConstants";

export const loginRequestAction = (userCredentials) => {
    return ({
        type: LOGIN_REQUEST
    });
};

export const loginSuccessAction = (user) => {
    return ({
        type: LOGIN_SUCCESS,
        payload: user
    });
};

export const loginFailAction = (error) => {
    return ({
        type: LOGIN_FAIL,
        payload: error
    });
};