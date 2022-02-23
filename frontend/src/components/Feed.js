import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './Feed.module.css';
import Post from './Post';
import Share from './Share';
import { useLocation, useRouteMatch } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import { FETCH_ALL_POSTS_FAIL, FETCH_ALL_POSTS_REQUEST, FETCH_ALL_POSTS_SUCCESS } from '../context/PostConstants';
import { CircularProgress } from '@mui/material';

const Feed = () => {
    const { posts, dispatch, loading, error } = useContext(PostContext);
    const { user } = useContext(AuthContext);
    const match = useRouteMatch();
    const [isCurrentUser, setIsCurrentUser] = useState(false);


    const getPosts = useCallback(async (url) => {
        try {
            dispatch({
                type: FETCH_ALL_POSTS_REQUEST
            });
            const { data } = await axios.get(url);
            dispatch({
                type: FETCH_ALL_POSTS_SUCCESS,
                payload: data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt))
            })

        } catch (e) {
            console.log(e);
            dispatch({
                type: FETCH_ALL_POSTS_FAIL,
                payload: e
            })
        }
    }, [dispatch]);

    useEffect(() => {
        if (match.url === '/') {
            getPosts('/api/posts/timeline/' + user._id.toString());
            setIsCurrentUser(true);
        } else {
            getPosts('/api/posts' + match.url);
            if (match.params.username === user.username) {
                setIsCurrentUser(true);
            } else {
                setIsCurrentUser(false);
            }
        }
    }, [match.url, user._id, getPosts, match.params, user.username]);


    return (
        <div className={styles['container']}>
            <div className={styles["wrapper"]}>
                {isCurrentUser && <Share />}
                {loading
                    ? <CircularProgress />
                    : <>
                        {error ? <p>{error.message}</p> :
                            posts.map((p) => (
                                <Post key={p._id} post={p} />
                            ))
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default Feed