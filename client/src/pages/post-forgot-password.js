import React from 'react';
import { Link } from 'gatsby';

import Layout from '@components/layout';

const PostForgotPassword = () => {
  return (
    <Layout>
      <h1>E-mail Sent</h1>
      <p>
        Check your e-mail for a reset password link. Then <Link to="/sign-in">sign in</Link> with your e-mail and
        password.
      </p>
    </Layout>
  );
};

export default PostForgotPassword;
