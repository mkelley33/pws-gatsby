import React from 'react';
import { Link } from 'gatsby';

import Layout from '@components/layout';
const PostResetPassword = (props) => {
  document.title = 'Reset Password';
  return (
    <Layout>
      <h2>Password Reset</h2>
      <p>
        Your password has successfully been reset. <Link to="/sign-in">Sign in</Link> again with your new password.
      </p>
    </Layout>
  );
};

export default PostResetPassword;
