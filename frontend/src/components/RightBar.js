import React from 'react'
import styles from './RightBar.module.css';
import { Users } from '../dummyData';
import Advertisement from './Advertisement';

const RightBar = () => {
    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['birthday-container']}>
                    <img className={styles['birthday-img']} src="/assets/gift.png" alt="" />
                    <span className={styles['birthday-text']}><strong>Hermoine Granger</strong> and <b>3 other friends</b> have birthday today</span>
                </div>
                {/* <div className={styles['rightbar-ad']}>
                    <Advertisement />
                </div> */}
                <img src="http://localhost:3000/assets/ad1.jpg" alt="" className={styles['rightbar-ad']} />
                <h4 className={styles['title']}>Online Friends</h4>
                <ul className={styles['friend-list']}>
                    {Users.map(user => (
                        <li className={styles['friend-item']} key={user.id}>
                            <div className={styles['profile-img-container']}>
                                <img className={styles['profile-img']} src={'http://localhost:3000/assets/default_dp.png'} alt='' />
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