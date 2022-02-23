import React, { useContext, useEffect, useState, useRef } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './Post.module.css';
import axios from 'axios';
import { format } from 'timeago.js';
import Picker from 'emoji-picker-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import { DELETE_POST_FAIL, DELETE_POST_REQUEST, DELETE_POST_SUCCESS } from '../context/PostConstants';
import Comment from './Comment';
import ConfirmModal from './ConfirmModal';

const Post = ({ post }) => {
    const [user, setUser] = useState({});
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const { user: currentUser, token } = useContext(AuthContext);
    const { error, dispatch } = useContext(PostContext);
    const [showOptions, setShowOptions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments);
    const [showPicker, setShowPicker] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const commentRef = useRef();

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

    const moreClickHandler = () => {
        if (post.userId.toString() === currentUser._id.toString()) {
            if (showOptions)
                setShowOptions(false);
            else
                setShowOptions(true);
        }
    }

    const showEditComponent = () => {
        // setShowEdit(true);
        setShowOptions(false);
    }

    const deletePostHandler = async () => {
        setOpenModal(true);
        try {
            dispatch({
                type: DELETE_POST_REQUEST
            });

            const reqConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.delete(`/api/posts/${post._id.toString()}`, reqConfig);
            if (data.error) {
                console.log(data.error)
                dispatch({
                    type: DELETE_POST_FAIL,
                    payload: data.error
                })
            } else {
                dispatch({
                    type: DELETE_POST_SUCCESS,
                    payload: post._id.toString()
                })
            }
        } catch (err) {
            console.log(err);
            dispatch({
                type: DELETE_POST_FAIL,
                payload: err.message
            })
        }
    }
    const onEmojiClick = (event, emojiObject) => {
        commentRef.current.value = commentRef.current.value + emojiObject.emoji;
        setShowPicker(false);
    };

    const postCommentHandler = async (e) => {
        e.preventDefault();
        const comment = commentRef.current.value.trim();
        if (comment !== '') {
            try {
                const reqConfig = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const commentData = {
                    userId: currentUser._id.toString(),
                    username: currentUser.username,
                    comment,
                    postedAt: Date.now()
                }
                const { data } = await axios.post(`/api/posts/${post._id.toString()}/comment`, commentData, reqConfig);
                if (data.error) {
                    console.log(data.error);
                } else {
                    commentRef.current.value = '';
                    setComments(prev => [commentData, ...prev]);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['top']}>
                    <div className={styles['top-left']}>
                        <Link to={`/profile/${user.username}`} >
                            <img src={user?.profilePicture || 'http://localhost:3000/assets/default_dp.png'} alt="" className={styles['post-user-img']} />
                        </Link>
                        <span className={styles['post-user-name']}>{user.username}</span>
                        <span className={styles['post-date']}>{format(post.createdAt)}</span>
                    </div>
                    <div className={styles['top-right']}>
                        <MoreVertIcon onClick={moreClickHandler} className={styles['options-btn']} />
                    </div>
                </div>
                {error && <div className={styles['error-msg']}>{error}</div>}
                {showOptions &&
                    <div className={styles['options-container']}>
                        <div className={styles['option']} onClick={showEditComponent}>
                            <span>Edit Post</span>
                        </div>
                        <div className={styles['option']} onClick={() => { setOpenModal(true) }}>
                            <span>Delete Post</span>
                        </div>
                    </div>}
                {openModal && <ConfirmModal closeModal={setOpenModal} onDelete={deletePostHandler} />}
                <div className={styles['center']}>
                    <span className={styles['post-text']}>{post?.description}</span>
                    <img src={post.image === '' ? '' : `http://localhost:8800/images/${post.image}`} alt="" className={styles['post-img']} />
                </div>
                <div className={styles['bottom']}>
                    <div className={styles['bottom-left']}>
                        <img className={styles['like-icon']} src="/assets/like.png" onClick={likeHandler} alt="" />
                        <img className={styles['like-icon']} src="/assets/heart.png" onClick={likeHandler} alt="" />
                        <span className={styles['post-like-counter']}>{like} people like it</span>
                    </div>
                    <div className={styles['bottom-right']}>
                        <span className={styles['comment-counter']} onClick={() => setShowComments(prev => !prev)}>{comments.length} comments</span>
                    </div>
                </div>
                <div>
                    <div>
                        <form className={styles['comment-form']} onSubmit={postCommentHandler}>
                            <img src={user?.profilePicture || 'http://localhost:3000/assets/default_dp.png'} alt="" className={styles['post-user-img']} />
                            <input type="text" placeholder='Any comments..' ref={commentRef} />
                            <img src="/assets/emoji.png" alt="" className={styles['emoji-icon']} onClick={() => setShowPicker(val => !val)} />
                            <button type='submit'>Post</button>

                        </form>
                        {showPicker && <Picker
                            pickerStyle={{ width: '100%' }}
                            onEmojiClick={onEmojiClick} />}
                    </div>
                    {showComments && <Comment comments={comments} onDelete={setComments} postId={post._id.toString()} />}
                </div>
            </div>
        </div>
    )
}

export default Post