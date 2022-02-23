import React, { useContext } from 'react';
import styles from './Comment.module.css';
import { format } from 'timeago.js';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Comment = ({ comments, onDelete, postId }) => {
    const { user, token } = useContext(AuthContext);
    const deleteCommentHandler = async (comment) => {
        try {
            const reqConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.delete(`/api/posts/${postId}/comment?postedAt=${comment.postedAt}`, reqConfig);
            if (data.error) {
                console.log(data.error);
            } else {
                onDelete(prev => {
                    return prev.filter(cmt => !(cmt.postedAt === comment.postedAt && comment.userId.toString() === user._id.toString()))
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className={styles['container']}>
            <hr />
            {comments.map(comment => (
                <div className={styles['comment']} id={comment.userId + comment.postedAt} >
                    <div className={styles['comment-left']}>
                        <img src={'http://localhost:3000/assets/default_dp.png'} alt="" className={styles['comment-user-img']} />
                        <div className={styles['comment-col']}>
                            <div>
                                <span className={styles['username']}>{comment.username}</span>
                                <span className={styles['time']}>{format(comment.postedAt)}</span>
                            </div>
                            <span className={styles['text']}>{comment.comment}</span>
                        </div>
                    </div>
                    <div>
                        {comment.userId === user._id.toString() ? <DeleteIcon className={styles['delete-icon']} onClick={() => deleteCommentHandler(comment)} /> : <MoreVertIcon />}

                    </div>
                </div>
            ))}
        </div>
    )
};

export default Comment;