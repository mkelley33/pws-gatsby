import React, { Component } from 'react';
import Profile from '@components/Profile/Profile';
import api from '../api';

import Layout from '@components/layout';

export default class ProfileContainer extends Component {
  state = {
    user: {},
  };

  async componentDidMount() {
    // Initial state required for formik
    const user = { currentPassword: '', password: '', confirmPassword: '' };
    try {
      const resp = await api.get(`/users/profile`);
      this.setState({ user: Object.assign(resp.data, user) });
    } catch (err) {
      // TODO: attempt to set a user-friendly error instead of re-throwing err
      throw err;
    }
  }

  render() {
    // TODO: if there's a problem getting the user's profile show a message
    if (!this.state.user.email) return null;
    return (
      <Layout>
        <Profile isAdmin={this.state.user.roles.includes('admin')} user={this.state.user} {...this.props} />
      </Layout>
    );
  }
}
