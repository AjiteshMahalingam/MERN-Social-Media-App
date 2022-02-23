import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './ProfileRightBar.module.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { FOLLOW_SUCCESS, UNFOLLOW_SUCCESS } from '../context/AuthConstants';

const ProfileRightBar = ({ user }) => {
    const [friendsList, setFriendsList] = useState([]);
    const { user: currentUser, token, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(currentUser.following.includes(user._id.toString()));
    useEffect(() => {
        const getFriendsList = async () => {
            try {
                const { data } = await axios.get(`/api/users/friends/${user._id.toString()}`);
                setFriendsList(data);
            } catch (err) {
                console.log(err);
            }
        }
        getFriendsList();
    }, [user._id]);

    let relationshipStatus;
    switch (user.relationship) {
        case '1':
            relationshipStatus = 'Single';
            break;
        case '2':
            relationshipStatus = 'In a relationship';
            break;
        case '3':
            relationshipStatus = 'Married';
            break;
        default:
            relationshipStatus = 'Unknown';
    }

    const followHandler = async () => {
        try {
            const reqConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            if (followed) {
                await axios.put(`/api/users/${user._id.toString()}/unfollow`, {}, reqConfig);
                dispatch({
                    type: UNFOLLOW_SUCCESS,
                    payload: user._id.toString()
                });
                setFollowed(false);
            } else {
                await axios.put(`/api/users/${user._id.toString()}/follow`, {}, reqConfig);
                dispatch({
                    type: FOLLOW_SUCCESS,
                    payload: user._id.toString()
                });
                setFollowed(true);
            }
        } catch (err) {
            console.log(err);
        }

    }
    return (
        <>
            <div className={styles['container']}>
                <div className={styles['wrapper']}>
                    {user.username !== currentUser.username && (
                        <button className={styles['follow-button']} onClick={followHandler} >
                            {followed || currentUser.following.includes(user._id.toString()) ? "Unfollow" : "Follow"}
                            {followed || currentUser.following.includes(user._id.toString()) ? <RemoveIcon /> : <AddIcon />}
                        </button>
                    )}
                    <h4 className={styles['title']}>User Information</h4>
                    <div className={styles['info']}>
                        <div className={styles['info-item']}>
                            <span className={styles['info-key']}>From : </span>
                            <span className={styles['info-value']}>{user.address}</span>
                        </div>
                        <div className={styles['info-item']}>
                            <span className={styles['info-key']}>City : </span>
                            <span className={styles['info-value']}>{user.city}</span>
                        </div>
                        <div className={styles['info-item']}>
                            <span className={styles['info-key']}>Country : </span>
                            <span className={styles['info-value']}>{user.country}</span>
                        </div>
                        <div className={styles['info-item']}>
                            <span className={styles['info-key']}>Relationship : </span>
                            <span className={styles['info-value']}>{relationshipStatus}</span>
                        </div>
                        {user.username === currentUser.username &&
                            <Link to='/profile/update'>
                                <button>Update Profile</button>
                            </Link>}
                    </div>
                    <h4 className={styles['title']}>User Friends</h4>
                    <div className={styles['following']}>
                        {friendsList.map(friend =>
                            <Link to={`/profile/${friend.username}`} style={{ textDecoration: 'none' }} key={friend._id.toString()} >
                                <div className={styles['following-item']} >
                                    <img src={friend?.profilePicture || 'http://localhost:3000/assets/default_dp.png'} alt="" className={styles['following-img']} />
                                    <span className={styles['following-name']}>{friend.username}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileRightBar