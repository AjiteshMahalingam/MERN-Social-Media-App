import React from 'react';
import styles from './Message.module.css';
import { format } from 'timeago.js';

const Message = ({ message, own }) => {
    const messageStyles = own ? 'container-own' : 'container';

    return (
        <div className={styles[messageStyles]}>
            <div className={styles['top']}>
                <img src="http://localhost:3000/assets/default_dp.png" alt="" className={styles['image']} />
                <p className={styles['text']}>
                    {message.text}
                </p>
            </div>
            <div className={styles['bottom']}>
                {format(message.createdAt)}
            </div>
        </div>
    )
}

export default Message