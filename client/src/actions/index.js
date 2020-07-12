import { navigate } from 'gatsby';

import api from '../api';
import { AUTH_USER, UNAUTH_USER, AUTH_FAILED } from './types';

export const signInUser = ({ email, password }) => async dispatch => {
  // TODO: put user object on response and in the payload.
  let payload;
  const response = await api.post('/auth/sign-in', { email, password }).catch(err => {
    payload = { authenticated: false, error: 'Invalid credentials' };
    if (err.toString().includes('401')) {
      dispatch({
        type: AUTH_FAILED,
        payload,
      });
    }
  });
  if (payload) {
    return payload;
  }
  localStorage.setItem('user', JSON.stringify(response.data));
  dispatch({
    type: AUTH_USER,
    payload: { authenticated: true },
  });
  navigate('/');
};

export const signOutUser = () => async dispatch => {
  await api.post('/auth/signout');
  dispatch({ type: UNAUTH_USER });
};
