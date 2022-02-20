import React from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import Feed from '../components/Feed'
import RightBar from '../components/RightBar'
import styles from './HomeScreen.module.css';
import { PostContextProvider } from '../context/PostContext'

const HomeScreen = () => {
    return (
        <>
            <TopBar />
            <div className={styles['container']}>
                <SideBar />
                <PostContextProvider>
                    <Feed />
                </PostContextProvider>
                <RightBar />
            </div>
        </>
    )
}

export default HomeScreen