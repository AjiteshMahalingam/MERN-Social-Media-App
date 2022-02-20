import React, { useContext, useRef } from 'react'
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS } from '../context/AuthConstants';
import { AuthContext } from '../context/AuthContext';
import styles from './LoginScreen.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

const LoginScreen = () => {
    const email = useRef();
    const password = useRef();
    const { user, loading, error, dispatch } = useContext(AuthContext);
    const history = useHistory();

    const loginHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: LOGIN_REQUEST });
        try {
            const { data } = await axios.post('/api/auth/login', {
                email: email.current.value,
                password: password.current.value
            });
            dispatch({
                type: LOGIN_SUCCESS,
                payload: data
            });
            window.localStorage.setItem("token", data.token);
            window.localStorage.setItem("user", JSON.stringify(data.user));
            history.push('/');
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err
            });
        }
    };
    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['left']}>
                    <h3 className={styles['logo']}>So Social</h3>
                    <span className={styles['desc']}>Connect with friends and the world around you on So Social</span>
                </div>
                <div className={styles['right']}>
                    <form className={styles['login-box']} onSubmit={loginHandler}>
                        <input type="email" name="email" className={styles['login-input']} placeholder='Enter Email' ref={email} required />
                        <input type="password" name="password" className={styles['login-input']} placeholder='Enter Password' ref={password} required />

                        {loading
                            ? <CircularProgress className={styles['loader']} />
                            : (<>
                                <button className={styles['button-login']} type='submit'>
                                    Log In
                                </button>
                                <span className={styles['forget']}>Forget Password ?</span>
                                <Link to='/register' style={{ textDecoration: 'none' }}><button className={styles['button-register']}>Create a New Account</button></Link>
                            </>
                            )
                        }

                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen