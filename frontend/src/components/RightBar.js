import React from 'react'
import styles from './RightBar.module.css';
import { Users } from '../dummyData';
// import Advertisement from './Advertisement';

const RightBar = () => {
    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['birthday-container']}>
                    <img className={styles['birthday-img']} src="/assets/gift.png" alt="" />
                    <span className={styles['birthday-text']}><strong>Hermoine Granger</strong> and <b>3 other friends</b> have birthday today</span>
                </div>
                <img className={styles['rightbar-ad']} src="/assets/ad1.jpg" alt="" />
                {/* <Advertisement className={styles['rightbar-ad']} /> */}
                <h4 className={styles['title']}>Online Friends</h4>
                <ul className={styles['friend-list']}>
                    {Users.map(user => (
                        <li className={styles['friend-item']} key={user.id}>
                            <div className={styles['profile-img-container']}>
                                <img className={styles['profile-img']} src="https://s2.favim.com/orig/151125/daniel-radcliffe-harry-potter-young-and-handsome-Favim.com-3646292.jpg" alt='' />
                                <span className={styles['online']}> </span>
                            </div>
                            <span className={styles['friend-name']}>{user.username}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default RightBar