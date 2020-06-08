import React, { Component } from 'react';
import { Link } from 'gatsby';
import { Router } from '@reach/router';
import { navigate } from 'gatsby';
import Layout from '@components/layout';

import api from '../api';

class EmailVerification extends Component {
  state = {
    isVerified: false,
  };

  componentDidMount() {
    // TODO: show loading spinner while verifying e-mail
    api
      .get(`/users/verification/${this.props.id}`)
      .then(res => {
        this.setState({ isVerified: true });
      })
      .catch(err => {
        if (err.response.status === 400 && err.response.data.message === 'already verified') {
          // Send them to the sign-in page
          navigate('/sign-in');
        } else if (err.response.status === 400 && err.response.data.message === 'expired token') {
          navigate('/expired-token');
        }
      });
  }

  render() {
    return (
      <Layout>
        <h2>E-mail Verification</h2>
        {this.state.isVerified ? (
          <p>
            Thank you for verifying your e-mail address. You may <Link to="/sign-in">sign in</Link> to your account now.
          </p>
        ) : (
          <div>Verifying e-mail address...</div>
        )}
      </Layout>
    );
  }
}

const Verification = () => (
  <Router>
    <EmailVerification path="/email-verification/:id" />
  </Router>
);

export default Verification;
