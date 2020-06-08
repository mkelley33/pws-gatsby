import { combineReducers } from 'redux';
import { AUTH_USER, UNAUTH_USER, AUTH_FAILED } from '../actions/types';

let initialState = { error: '', message: '', content: '' };

function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        error: '',
        message: '',
        authenticated: true,
        payload: action.payload,
      };
    case UNAUTH_USER:
      return { ...state, authenticated: false };
    case AUTH_FAILED:
      return { ...state, authenticated: false, error: action.payload };
    default:
      return state;
  }
}

export default combineReducers({
  auth,
});
