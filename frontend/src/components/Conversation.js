import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import styles from './Conversation.module.css';

const Conversation = ({ conversation }) => {
    const [user, setUser] = useState(null);
    const { user: currentUser } = useContext(AuthContext);
    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id.toString());
        const getUser = async () => {
            try {
                const { data } = await axios.get(`/api/users?userId=${friendId}`);
                // console.log(data);
                setUser(data);
            } catch (err) {
                console.log(err);
            }
        }
        getUser();
    }, [currentUser, conversation]);

    return (
        <div className={styles['container']}>
            <img src={user?.profilePicture || 'http://localhost:3000/assets/default_dp.png'} alt="" className={styles['image']} />
            <span className={styles['name']}>{user?.username}</span>
        </div>
    )
}

export default Conversation