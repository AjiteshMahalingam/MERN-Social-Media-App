import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './ChatOnline.module.css';

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const { data } = await axios.get(`/api/users/friends/${currentId?.toString()}`);
                setFriends(data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, [currentId]);

    useEffect(() => {
        setOnlineFriends(friends.filter(f => onlineUsers.includes(f._id.toString())));
    }, [friends]);

    console.log(onlineFriends);
    return (
        <div className={styles['container']}>
            {onlineFriends.map(o => {
                <div className={styles['online-friend']} key={o._id.toString()} onClick={ }>
                    <div className={styles['image-container']}>
                        <img src="http://localhost:3000/assets/default_dp.png" alt="" className={styles['image']} />
                        <div className={styles['online-badge']}></div>
                    </div>
                    <span className={styles['name']}>{o.username}</span>
                </div>
            })}
        </div>
    )
}

export default ChatOnline