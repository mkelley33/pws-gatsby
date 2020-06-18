import React from 'react';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { connect } from 'react-redux';

import { signInUser } from '../actions';
import TextInput from '@components/common/forms/TextInput';
import Modal from '@components/Modal/Modal';
import ForgotPassword from '@components/ForgotPassword';
import commonStyles from '@components/common/common.module.css';
import styles from './sign-in.module.css';
import Layout from '@components/layout';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required!'),
    password: Yup.string().required('Password is required'),
  }),
  handleSubmit: async (payload, { setSubmitting, setErrors, props }) => {
    const errors = await props.signInUser({ ...payload });
    if (errors) {
      setErrors({ invalidCredentials: errors.error });
    }
    setSubmitting(false);
  },
  mapPropsToValues: () => ({
    email: '',
    password: '',
    invalidCredentials: '',
  }),
  displayName: 'SignInForm',
});

const SignIn = (props) => {
  document.title = 'Sign In';
  const { values, touched, errors, dirty, handleChange, handleBlur, handleSubmit, isSubmitting } = props;

  const modalProps = {
    triggerText: 'Forgot Password?',
  };

  const modalContent = <ForgotPassword user={{ email: '' }} {...props} />;

  return (
    <Layout>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <TextInput
          id="email"
          type="email"
          label="Email"
          error={touched.email && errors.email}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="password"
          type="password"
          label="Password"
          error={touched.password && errors.password}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="text-danger">{errors && errors.invalidCredentials}</div>
        <button type="submit" disabled={!dirty || isSubmitting} className="btn btn-primary">
          Sign In
        </button>
      </form>
      <div className={styles.forgotPassword}>
        <Modal
          modalProps={modalProps}
          modalContent={modalContent}
          modalButtonClassName={commonStyles.modalLinkButton}
          {...props}
        />
      </div>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
    error: state.error,
  };
}

export default connect(mapStateToProps, { signInUser })(formikEnhancer(SignIn));
