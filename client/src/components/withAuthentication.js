import React, { Component } from 'react';
import { navigate } from 'gatsby';
import { connect } from 'react-redux';
import api from '../api';
import { signOutUser } from '../actions';

const withAuthentication = WrappedComponent => {
  class HOC extends Component {
    state = {
      isAuthenticated: false,
    };

    componentDidMount() {
      api
        .get('/auth/is-authenticated')
        .then(res => {
          this.setState({ isAuthenticated: true });
        })
        .catch(err => {
          this.props.signOutUser();
          navigate('/sign-in');
        });
    }

    render() {
      if (!this.state.isAuthenticated) return null;
      return <WrappedComponent isAuthenticated={this.state.isAuthenticated} />;
    }
  }
  return connect(null, { signOutUser })(HOC);
};

export default withAuthentication;
