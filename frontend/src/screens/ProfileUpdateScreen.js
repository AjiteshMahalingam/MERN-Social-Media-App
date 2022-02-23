import React, { useContext, useEffect, useState } from 'react';
import styles from './ProfileUpdateScreen.module.css';
import TopBar from '../components/TopBar';
import Person from '@mui/icons-material/Person';
import ShortText from '@mui/icons-material/ShortText';
import Cake from '@mui/icons-material/Cake';
import LocationCity from '@mui/icons-material/LocationCity';
import Language from '@mui/icons-material/Language';
import Home from '@mui/icons-material/Home';
import People from '@mui/icons-material/People';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { TOKEN_REQUEST, TOKEN_SUCCESS, TOKEN_FAIL } from '../context/AuthConstants';
import { useHistory } from 'react-router-dom';

const ProfileUpdateScreen = () => {
    const { user, token } = useContext(AuthContext);
    const [values, setValues] = useState({
        username: user?.username || '',
        description: user?.description || '',
        birthday: user?.birthday?.substring(10) || '',
        address: user?.address || '',
        city: user?.city || '',
        country: user?.country || '',
        relationshipStatus: user?.relationshipStatus || '',
        // profilePicture:'',
        // coverPicture:''
    });
    const history = useHistory();

    const changeHandler = (e) => {
        setValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const reqConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`/api/users/${user._id.toString()}`, values, reqConfig);
            history.push(`/profile/${user.username}`);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <TopBar />
            <div className={styles['container']}>
                <div className={styles['wrapper']}>
                    <p className={styles['title']}>Update User Profile</p>
                    <hr className={styles['hr']} />
                    <form onSubmit={submitHandler}>
                        <div className={styles['form-input']}>
                            <Person className={styles['icon']} />
                            <input
                                name='username'
                                type="text"
                                placeholder='Username'
                                value={values.username}
                                onChange={changeHandler}
                                required
                            />
                        </div>
                        <div className={styles['form-input']}>
                            <ShortText className={styles['icon']} />
                            <input
                                name='description'
                                type="text"
                                placeholder='Description'
                                value={values.description}
                                onChange={changeHandler}
                            />
                        </div>
                        <div className={styles['form-input']}>
                            <Cake className={styles['icon']} />
                            <input name='birthday' type="date" value={values.birthday} onChange={changeHandler} />
                        </div>
                        <div className={styles['form-input']}>
                            <Home className={styles['icon']} />
                            <input name='address' type="text" placeholder='Address' value={values.address} onChange={changeHandler} />
                        </div>
                        <div className={styles['form-input']}>
                            <LocationCity className={styles['icon']} />
                            <input name='city' type="text" placeholder='City' value={values.city} onChange={changeHandler} />
                        </div>
                        <div className={styles['form-input']}>
                            <Language className={styles['icon']} />
                            <input name='country' type="text" placeholder='Country' value={values.country} onChange={changeHandler} />
                        </div>
                        <div className={styles['form-input-radio']}>
                            <div>
                                <People className={styles['icon']} />
                            </div>
                            <div className={styles['form-input-radio-row']}>
                                <div className={styles['form-input-radio-col']} >
                                    <div>
                                        <input name='relationshipStatus' type="radio" value='1' id='S' checked={values.relationshipStatus === '1' ? 'checked' : ''} onChange={changeHandler} /><label htmlFor="S">Single</label>
                                    </div>
                                    <div>
                                        <input name='relationshipStatus' type="radio" value='2' id='C' checked={values.relationshipStatus === '2' ? 'checked' : ''} onChange={changeHandler} /><label htmlFor="C">In a relationship</label>
                                    </div>
                                </div>
                                <div className={styles['form-input-radio-col']}>
                                    <div>
                                        <input name='relationshipStatus' type="radio" value='3' id='M' checked={values.relationshipStatus === '3' ? 'checked' : ''} onChange={changeHandler} /><label htmlFor="M">Married</label>
                                    </div>
                                    <div>
                                        <input name='relationshipStatus' type="radio" value='4' id='U' checked={values.relationshipStatus === '4' ? 'checked' : ''} onChange={changeHandler} /><label htmlFor="U">Unknown</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className={styles['form-input']}>
                            <label htmlFor="">Profile Picture</label>
                            <input name='profilePicture' type="file" value={values.profilePicture} onChange={changeHandler} />
                        </div>
                        <div className={styles['form-input']}>
                            <label htmlFor="">Cover Picture</label>
                            <input name='coverPicture' type="file" value={values.coverPicture} onChange={changeHandler} />
                        </div> */}
                        <button type='submit' className={styles['form-button']}>Update</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProfileUpdateScreen