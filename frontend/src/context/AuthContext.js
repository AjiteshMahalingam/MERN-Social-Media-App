import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user: null,
    loading: false,
    error: null,
    token: ''
};

INITIAL_STATE.token = window.localStorage.getItem('token') ? window.localStorage.getItem('token') : '';
INITIAL_STATE.user = window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null;
// console.log(INITIAL_STATE);
export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}