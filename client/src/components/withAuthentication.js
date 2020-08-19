import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { connect } from 'react-redux';
import api from '../api';
import { signOutUser } from '../actions';

const withAuthentication = WrappedComponent => {
  const HOC = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      api
        .get('/auth/is-authenticated')
        .then(res => {
          setIsAuthenticated(true);
        })
        .catch(err => {
          props.signOutUser();
          navigate('/sign-in');
        });
    }, []);

    if (!isAuthenticated) return null;
    return <WrappedComponent isAuthenticated={isAuthenticated} {...props} />;
  };
  return connect(null, { signOutUser })(HOC);
};

export default withAuthentication;
