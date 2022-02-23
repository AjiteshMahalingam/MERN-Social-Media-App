import { CREATE_POST_FAIL, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, DELETE_POST_FAIL, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, FETCH_ALL_POSTS_FAIL, FETCH_ALL_POSTS_REQUEST, FETCH_ALL_POSTS_SUCCESS } from "./PostConstants";

const PostReducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case FETCH_ALL_POSTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_ALL_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.payload,
                loading: false,
                error: null
            }
        case FETCH_ALL_POSTS_FAIL:
            return {
                ...state,
                posts: [],
                loading: false,
                error: action.payload
            }
        case CREATE_POST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CREATE_POST_SUCCESS:
            return {
                ...state,
                posts: [action.payload, ...state.posts],
                loading: false,
                error: null
            }
        case CREATE_POST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DELETE_POST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case DELETE_POST_SUCCESS:
            return {
                ...state,
                posts: state.posts.filter(post => post._id.toString() !== action.payload),
                loading: false,
                error: null
            }
        case DELETE_POST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}

export default PostReducer;