import React, { useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Link } from 'react-router-dom';
import styles from './TopBar.module.css';
import { AuthContext } from '../context/AuthContext';

const TopBar = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className={styles['container']}>
            <div className={styles["left"]}>
                <Link to='/' style={{ 'textDecoration': 'none' }}>
                    <span className={styles["logo"]}>So Social</span>
                </Link>
            </div>
            <div className={styles["center"]}>
                <div className={styles["searchbar"]}>
                    <SearchIcon className={styles["icon-search"]} />
                    <input placeholder='Search for friend, post or video' className={styles["searchinput"]} />
                </div>
            </div>
            <div className={styles["right"]}>
                <div className={styles["links"]}>
                    <span className={styles["link-item"]}>HomePage</span>
                    <span className={styles["link-item"]}>Timeline</span>
                </div>
                <div className={styles["icons"]}>
                    <div className={styles["icon-item"]}>
                        <PersonIcon />
                        <span className={styles["icon-badge"]}>1</span>
                    </div>
                    <div className={styles["icon-item"]}>
                        <ChatIcon />
                        <span className={styles["icon-badge"]}>1</span>
                    </div>
                    <div className={styles["icon-item"]}>
                        <NotificationsActiveIcon />
                        <span className={styles["icon-badge"]}>1</span>
                    </div>
                </div>
                <Link to={`/profile/${user.username}`}>
                    <img
                        src={user.profilePicture || "http://localhost:3000/assets/default_dp.png"}
                        alt="profile pic"
                        className={styles['image']} />
                </Link>
            </div>
        </div>
    )
}

export default TopBar