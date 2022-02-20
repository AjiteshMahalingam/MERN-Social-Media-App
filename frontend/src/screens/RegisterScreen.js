import React, { useContext, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom';
import styles from './RegisterScreen.module.css';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../context/AuthContext';
import { REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from '../context/AuthConstants';

const RegisterScreen = () => {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const repassword = useRef();

    const { loading, error, dispatch } = useContext(AuthContext);
    const history = useHistory();

    const registerHandler = async (e) => {
        e.preventDefault();
        if (password.current.value !== repassword.current.value) {
            password.current.setCustomValidity("Passwords didn't match");
        } else {
            dispatch({
                type: REGISTER_REQUEST
            });
            try {
                const { data } = await axios.post('/api/auth/register', {
                    username: username.current.value,
                    password: password.current.value,
                    email: email.current.value
                });
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: data
                });
                window.localStorage.setItem("token", data.token);
                window.localStorage.setItem("user", JSON.stringify(data.user));
                history.push('/');
            } catch (e) {
                console.log(e);
                dispatch({
                    type: REGISTER_FAIL,
                    payload: e
                });
            }
        }
    }
    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['left']}>
                    <h3 className={styles['logo']}>So Social</h3>
                    <span className={styles['desc']}>Connect with friends and the world around you on So Social</span>
                </div>
                <div className={styles['right']}>
                    <form className={styles['register-box']} onSubmit={registerHandler}>
                        <input type="text" name="username" className={styles['register-input']} placeholder='Enter Username' ref={username} required />
                        <input type="email" name="email" className={styles['register-input']} placeholder='Enter Email' ref={email} required />
                        <input type="password" name="password" className={styles['register-input']} placeholder='Enter Password' ref={password} required minLength={7} />
                        <input type="password" name="re-password" className={styles['register-input']} placeholder='Re-Enter Password' ref={repassword} required minLength={7} />
                        {loading ? <CircularProgress className={styles['loader']} /> : <>
                            <button className={styles['button-register']} type='submit' >Sign Up</button>
                            <Link to='/login'>
                                <button className={styles['button-login']}>Log in to your account</button>
                            </Link>
                        </>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen