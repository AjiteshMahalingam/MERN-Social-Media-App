import React, { useContext, useRef, useState } from 'react';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LabelIcon from '@mui/icons-material/Label';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './Share.module.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { PostContext } from '../context/PostContext';
import { CREATE_POST_FAIL, CREATE_POST_REQUEST, CREATE_POST_SUCCESS } from '../context/PostConstants';

const Share = () => {
    const { dispatch } = useContext(PostContext);
    const { user, token } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const desc = useRef();

    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = new FormData();
        newPost.append('userId', user._id.toString());
        newPost.append('description', desc.current.value);
        if (file) {
            newPost.append('file', file);
        }
        try {
            dispatch({
                type: CREATE_POST_REQUEST
            });
            const reqConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post('/api/posts/', newPost, reqConfig);
            dispatch({
                type: CREATE_POST_SUCCESS,
                payload: data
            });
        } catch (e) {
            console.log(e);
            dispatch({
                type: CREATE_POST_FAIL,
                payload: e
            });
        }
        desc.current.value = '';
        setFile(null);
    };

    const cancelHandler = () => {
        setFile(null);
    }

    const selectFileHandler = (e) => {
        console.log(e.target.files);
        setFile(e.target.files[0])
    }
    return (
        <div className={styles['container']} >
            <div className={styles['wrapper']}>
                <div className={styles['top']}>
                    <img src={user.profileImg || 'http://localhost:3000/assets/default_dp.png'} alt="" className={styles["friend-img"]} />
                    <input type="text" placeholder="What's in your mind?" className={styles['share-input']} ref={desc} />
                </div>
                <hr className={styles["share-hr"]} />
                {file && (
                    <div className={styles["share-image-container"]}>
                        <CancelIcon className={styles["share-cancel"]} onClick={cancelHandler} />
                        <img src={URL.createObjectURL(file)} alt="" className={styles["share-image"]} />
                    </div>
                )}
                <form className={styles['bottom']} onSubmit={submitHandler} >
                    <div className={styles["share-options"]}>
                        <label htmlFor='file' className={styles["option"]}>
                            <PermMediaIcon htmlColor='tomato' className={styles['share-icon']} />
                            <span className={styles["option-text"]}>Photo or Video</span>
                            <input type="file" id='file' name='file'
                                accept='.png,.jpg,.jpeg'
                                onChange={selectFileHandler}
                                style={{ display: 'none' }} />
                        </label>
                        <div className={styles["option"]}>
                            <LabelIcon htmlColor='blue' className={styles['share-icon']} />
                            <span className={styles["option-text"]}>Tag</span>
                        </div>
                        <div className={styles["option"]}>
                            <AddLocationAltIcon htmlColor='green' className={styles['share-icon']} />
                            <span className={styles["option-text"]}>Location</span>
                        </div>
                        <div className={styles["option"]}>
                            <EmojiEmotionsIcon htmlColor='goldenrod' className={styles['share-icon']} />
                            <span className={styles["option-text"]}>Feelings</span>
                        </div>
                    </div>
                    <button className={styles['share-btn']} type='submit'>Share Post</button>
                </form>
            </div>
        </div>
    )
}

export default Share