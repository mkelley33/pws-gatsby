import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'gatsby';

import Layout from '@components/layout';
import { signOutUser } from '../actions';

class SignOut extends Component {
  componentDidMount() {
    this.props.signOutUser();
  }

  render() {
    return (
      <Layout>
        <p>You have been successfully signed out.</p>
        <p>
          <Link to="/sign-in">Sign in again</Link>
        </p>
      </Layout>
    );
  }
}

export default connect(
  null,
  { signOutUser }
)(SignOut);
