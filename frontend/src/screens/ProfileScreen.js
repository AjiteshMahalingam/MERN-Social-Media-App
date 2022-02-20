import React, { useContext, useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import Feed from '../components/Feed'
import ProfileRightBar from '../components/ProfileRightBar'
import styles from './ProfileScreen.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PostContextProvider } from '../context/PostContext'
import { AuthContext } from '../context/AuthContext'

const ProfileScreen = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [user, setUser] = useState(currentUser);
    const params = useParams();
    const username = params.username;

    useEffect(() => {
        const getUser = async () => {
            if (username) {
                const { data } = await axios.get(`/api/users?username=${username}`);
                setUser(data);
            } else {
                const { data } = await axios.get(`/api/users?username=${currentUser.username}`);
                setUser(data);
            }
        };
        try {
            getUser();
        } catch (e) {
            console.log(e);
        }
    }, [username, currentUser.username]);

    return (
        <>
            <TopBar />
            <div className={styles['container']}>
                <SideBar />
                <div className={styles['right']}>
                    <div className={styles['right-top']}>
                        <div className={styles['profile-cover']}>
                            <img className={styles['cover-img']} src={user.coverPicture || "http://localhost:3000/assets/cover.jpg"} alt="" />
                            <img className={styles['profile-img']} src={user.profilePicture || "http://localhost:3000/assets/default_dp.png"} alt="" />
                        </div>
                        <div className={styles['profile-info']}>
                            <h4 className={styles['info-name']}>{user.username}</h4>
                            <span className={styles['info-desc']}>{user.description}</span>
                        </div>
                    </div>
                    <div className={styles['right-bottom']}>
                        <PostContextProvider>
                            <Feed />
                        </PostContextProvider>
                        <ProfileRightBar user={user || currentUser} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileScreen