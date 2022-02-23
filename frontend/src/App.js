import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileUpdateScreen from './screens/ProfileUpdateScreen';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import { TOKEN_FAIL, TOKEN_REQUEST, TOKEN_SUCCESS } from './context/AuthConstants';
import { CircularProgress } from '@mui/material';
import MessengerScreen from './screens/MessengerScreen';

function App() {
  const { user, loading, error, dispatch, token } = useContext(AuthContext);

  useEffect(() => {
    const getUser = async () => {
      if (token) {
        try {
          dispatch({
            type: TOKEN_REQUEST
          });
          const { data } = await axios.post(`/api/auth/token?token=${token}`, {});
          dispatch({
            type: TOKEN_SUCCESS,
            payload: { user: data, token: token }
          });
        } catch (err) {
          dispatch({
            type: TOKEN_FAIL,
            payload: err
          });
        }
      }
    }
    getUser();
  }, [dispatch, token]);

  if (loading) {
    return <CircularProgress />
  }
  // console.log(user);
  return (
    <Switch>
      <Route path='/' exact>
        {user ? <HomeScreen /> : <Redirect to='/login' />}
      </Route>
      <Route path='/login'>
        {user ? <Redirect to='/' /> : <LoginScreen />}
      </Route>
      <Route path='/register'>
        {user ? <Redirect to='/' /> : <RegisterScreen />}
      </Route>
      <Route path='/messenger'>
        {!user ? <Redirect to='/login' /> : <MessengerScreen />}
      </Route>
      <Route path='/profile/update' exact>
        {!user ? <Redirect to='/login' /> : <ProfileUpdateScreen />}
      </Route>
      <Route path='/profile/:username?'>
        <ProfileScreen />
      </Route>
    </Switch>
  );
}

export default App;
