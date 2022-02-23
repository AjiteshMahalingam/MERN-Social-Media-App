import React, { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Link, useHistory } from 'react-router-dom';
import styles from './TopBar.module.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LOGOUT_FAIL, LOGOUT_REQUEST, LOGOUT_SUCCESS } from '../context/AuthConstants';

const TopBar = () => {
    const { user, token, dispatch } = useContext(AuthContext);
    const history = useHistory();
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [usernameList, setUsernameList] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const { data } = await axios.get('/api/users/all');
                setUsernameList(data);
            } catch (err) {
                console.log(err);
            }
        }
        getUsers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            console.log("searching", searchTerm)
            const filteredUsers = usernameList.filter(name => name.includes(searchTerm));
            setSearchResults(filteredUsers);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const searchHandler = (e) => {
        setSearchTerm(e.target.value);
    }
    const logoutHandler = async () => {
        try {
            dispatch({
                type: LOGOUT_REQUEST
            });
            const reqConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post('/api/users/logout', {}, reqConfig);
            if (data.error) {
                dispatch({
                    type: LOGOUT_FAIL
                });
            } else {
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('user');
                dispatch({
                    type: LOGOUT_SUCCESS
                });
                history.push('/login');
            }
        } catch (err) {
            console.log(err);
            dispatch({
                type: LOGOUT_FAIL
            });
        }
    }

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
                    <input
                        placeholder='Search for friend, post or video'
                        className={styles["searchinput"]}
                        value={searchTerm}
                        onChange={searchHandler}
                    />
                </div>
                {searchResults.length !== 0 &&
                    <div className={styles["search-results"]}>
                        {searchResults.map(res => (
                            <Link
                                to={`/profile/${res}`}
                                key={res}
                                style={{ textDecoration: 'none', color: 'black' }}
                                onClick={() => setSearchTerm('')}>
                                <div className={styles["search-entry"]}>
                                    <img src="http://localhost:3000/assets/default_dp.png" alt="" />
                                    <span>{res}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                }
            </div>
            <div className={styles["right"]}>
                <div className={styles["links"]}>
                    <span className={styles["link-item"]}>Timeline</span>
                </div>
                <div className={styles["icons"]}>
                    <div className={styles["icon-item"]}>
                        <PersonIcon />
                        <span className={styles["icon-badge"]}>1</span>
                    </div>
                    <Link to={`/messenger`}>
                        <div className={styles["icon-item"]}>
                            <ChatIcon />
                            <span className={styles["icon-badge"]}>1</span>
                        </div>
                    </Link>
                    <div className={styles["icon-item"]}>
                        <NotificationsActiveIcon />
                        <span className={styles["icon-badge"]}>1</span>
                    </div>
                </div>
                <Link to={`/profile/${user?.username}`}>
                    <img
                        src={user?.profilePicture || "http://localhost:3000/assets/default_dp.png"}
                        alt="profile pic"
                        className={styles['image']} />
                </Link>
            </div>
            <div>
                <span className={styles["link-item"]} onClick={logoutHandler}>Logout</span>
            </div>
        </div>
    )
}

export default TopBar