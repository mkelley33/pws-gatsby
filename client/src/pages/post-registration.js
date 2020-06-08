import React from 'react';
import { Link } from 'gatsby';

import Layout from '@components/layout';

const PostRegistration = () => {
  return (
    <Layout>
      <h2>E-mail Verification</h2>
      <p>
        Check your e-mail for a verification link to activate your account. Then{' '}
        <Link to="/sign-in">sign in</Link> with your e-mail and password.
      </p>
    </Layout>
  );
};

export default PostRegistration;
