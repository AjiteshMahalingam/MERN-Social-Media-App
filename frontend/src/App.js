import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
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
      const _token = window.localStorage.getItem('token');
      if (_token) {
        try {
          dispatch({
            type: TOKEN_REQUEST
          });
          const { data } = await axios.post(`/api/auth/token?token=${_token}`, {});
          dispatch({
            type: TOKEN_SUCCESS,
            payload: { user: data, token: _token }
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
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />
  }
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
        {!user ? <Redirect to='/' /> : <MessengerScreen />}
      </Route>
      <Route path='/profile/:username?'>
        <ProfileScreen />
      </Route>
    </Switch>
  );
}

export default App;
