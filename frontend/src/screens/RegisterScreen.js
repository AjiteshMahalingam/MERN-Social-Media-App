import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import styles from './RegisterScreen.module.css';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../context/AuthContext';
import { REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from '../context/AuthConstants';

const RegisterScreen = () => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { loading, error, dispatch } = useContext(AuthContext);
    const history = useHistory();

    const registerHandler = async (e) => {
        e.preventDefault();

        dispatch({
            type: REGISTER_REQUEST
        });
        try {
            const { data } = await axios.post('/api/auth/register', {
                username: values.username,
                password: values.password,
                email: values.email
            });
            dispatch({
                type: REGISTER_SUCCESS,
                payload: data
            });
            window.localStorage.setItem("token", data.token);
            window.localStorage.setItem("user", JSON.stringify(data.user));
            history.push('/profile/update');
        } catch (e) {
            console.log(e);
            dispatch({
                type: REGISTER_FAIL,
                payload: e
            });
        }

    }

    const changeHandler = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['left']}>
                    <h3 className={styles['logo']}>So Social</h3>
                    <span className={styles['desc']}>Connect with friends and the world around you on So Social</span>
                </div>
                <div className={styles['right']}>
                    <form className={styles['register-box']} onSubmit={registerHandler}>
                        <input
                            type="text"
                            name="username"
                            className={styles['register-input']}
                            placeholder='Enter Username'
                            required
                            errorMessage='Username name should atleast 7 characters long'
                            minLength={7}
                            onChange={changeHandler}
                        />
                        <input
                            type="email"
                            name="email"
                            className={styles['register-input']}
                            placeholder='Enter Email'
                            required
                            errorMessage='Enter valid email address'
                            onChange={changeHandler}
                        />
                        <input
                            type="password"
                            name="password"
                            className={styles['register-input']}
                            placeholder='Enter Password'
                            required
                            minLength={7}
                            errorMessage="Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!"
                            pattern={`^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`}
                            onChange={changeHandler}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            className={styles['register-input']}
                            placeholder='Confirm Password'
                            required
                            minLength={7}
                            errorMessage="Passwords don't match!"
                            pattern={values.password}
                            onChange={changeHandler}
                        />
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