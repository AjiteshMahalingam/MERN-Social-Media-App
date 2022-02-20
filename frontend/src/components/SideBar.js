import React from 'react';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ChatIcon from '@mui/icons-material/Chat';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GroupIcon from '@mui/icons-material/Group';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import styles from './SideBar.module.css';
import { Users } from '../dummyData';

const SideBar = () => {
    return (
        <div className={styles['container']}>
            <div className={styles["wrapper"]}>
                <ul className={styles["sidebar-list"]}>
                    <li className={styles["list-item"]}>
                        <RssFeedIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Feed</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <ChatIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Chats</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <PlayCircleIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Videos</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <GroupIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Groups</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <BookmarkIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Bookmarks</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <HelpOutlineIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Questions</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <WorkIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Jobs</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <EventIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Events</span>
                    </li>
                    <li className={styles["list-item"]}>
                        <SchoolIcon className={styles["list-icon"]} />
                        <span className={styles["list-item-text"]}>Courses</span>
                    </li>
                </ul>
                <button className={styles["sidebar-button"]}>Show More</button>
                <hr className={styles["sidebar-hr"]} />
                <ul className={styles["friends-list"]}>
                    {Users.map(user => (
                        <li className={styles["friend-item"]} key={user.id}>
                            <img src="https://s2.favim.com/orig/151125/daniel-radcliffe-harry-potter-young-and-handsome-Favim.com-3646292.jpg" alt="" className={styles["friend-img"]} />
                            <span className={styles["friend-name"]}>{user.username}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SideBar