import React, { useContext, useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './Post.module.css';
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Post = ({ post }) => {
    const [user, setUser] = useState({});
    const [like, setLike] = useState(post.likes.length);
    const [optionShow, setOptionShow] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const { user: currentUser, token } = useContext(AuthContext);

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id.toString()));
    }, [post.likes, currentUser._id]);

    useEffect(() => {
        try {
            const getUser = async () => {
                const { data } = await axios.get(`/api/users?userId=${post.userId.toString()}`);
                setUser(data);
            };
            getUser();
        } catch (e) {
            console.log(e);
        }
    }, [post.userId]);

    const likeHandler = async () => {
        try {
            const reqConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`/api/posts/${post._id.toString()}/like`, {}, reqConfig);
            if (isLiked) {
                setLike(prev => prev - 1);
                setIsLiked(false);
            } else {
                setIsLiked(true);
                setLike(prev => prev + 1);
            }
        } catch (e) {
            console.log(e);
        }
    }
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };
    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['top']}>
                    <div className={styles['top-left']}>
                        <Link to={`/profile/${user.username}`} >
                            <img src={user.profilePicture ? `data:image/png;base64,${arrayBufferToBase64(user.profilePicture.data)}` : 'http://localhost:3000/assets/default_dp.png'} alt="" className={styles['post-user-img']} />
                        </Link>
                        <span className={styles['post-user-name']}>{user.username}</span>
                        <span className={styles['post-date']}>{format(post.createdAt)}</span>
                    </div>
                    <div className={styles['top-right']}>
                        <MoreVertIcon />
                    </div>
                </div>
                <div className={styles['center']}>
                    <span className={styles['post-text']}>{post?.description}</span>
                    <img src={post.image ? `data:image/png;base64,${arrayBufferToBase64(post.image.data)}` : ""} alt="" className={styles['post-img']} />
                </div>
                <div className={styles['bottom']}>
                    <div className={styles['bottom-left']}>
                        <img className={styles['like-icon']} src="/assets/like.png" onClick={likeHandler} alt="" />
                        <img className={styles['like-icon']} src="/assets/heart.png" onClick={likeHandler} alt="" />
                        <span className={styles['post-like-counter']}>{like} people like it</span>
                    </div>
                    <div className={styles['bottom-right']}>
                        <span className={styles['comment-counter']}>{post.comments.length} comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post