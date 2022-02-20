import { FOLLOW_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS, TOKEN_FAIL, TOKEN_REQUEST, TOKEN_SUCCESS, UNFOLLOW_SUCCESS } from "./AuthConstants";

const AuthReducer = (state, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                user: null,
                loading: true,
                error: null
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        case LOGIN_FAIL:
            return {
                ...state,
                user: null,
                loading: false,
                error: action.payload
            };
        case REGISTER_REQUEST:
            return {
                ...state,
                user: null,
                loading: true,
                error: null
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        case REGISTER_FAIL:
            return {
                ...state,
                user: null,
                loading: false,
                error: action.payload
            };
        case TOKEN_REQUEST:
            return {
                ...state,
                user: null,
                loading: true,
                error: null
            };
        case TOKEN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        case TOKEN_FAIL:
            return {
                ...state,
                user: null,
                loading: false,
                error: action.payload
            };
        case FOLLOW_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    following: [...state.user.following, action.payload]
                }
            };
        case UNFOLLOW_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    following: state.user.following.filter(f => f !== action.payload)
                }
            };
        default:
            return state;
    }
}

export default AuthReducer;