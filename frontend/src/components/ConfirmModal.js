import React from 'react'
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ title, body, closeModal, onDelete }) => {
    return (
        <div className={styles['background']}>
            <div className={styles['container']}>
                <div className={styles['close']}>
                    <button
                        onClick={() => closeModal(false)}
                    > X </button>
                </div>
                <div className={styles['title']}>
                    <h1>Delete Post</h1>
                </div>
                <div className={styles['body']}>
                    <p>Are you sure?</p>
                </div>
                <div className={styles['footer']}>
                    <button
                        className={styles['cancel']}
                        onClick={() => closeModal(false)}
                    >Cancel</button>
                    <button
                        className={styles['confirm']}
                        onClick={() => {
                            onDelete();
                            closeModal(true);
                        }}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal