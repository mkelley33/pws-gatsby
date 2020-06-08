import React from 'react';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { navigate } from 'gatsby';

import TextInput from './common/forms/TextInput';
import api from '../api';
import styles from '@components/Modal/modal.module.css';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
  }),
  mapPropsToValues: ({ user }) => ({
    ...user,
  }),
  handleSubmit: (payload, { setSubmitting, setErrors, props }) => {
    api
      .post('/auth/forgot-password', payload)
      .then(res => {
        document.querySelector('html').classList.toggle(styles.scrollLock);
        navigate('/post-forgot-password');
      })
      .catch(err => {
        setErrors({ email: "We're sorry, but something went wrong." });
      });
    setSubmitting(false);
  },
  displayName: 'ForgotPasswordForm',
});

const ForgotPassword = props => {
  document.title = 'Forgot Password';
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = props;
  return (
    <React.Fragment>
      <h2>Forgot Password</h2>
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </React.Fragment>
  );
};

export default formikEnhancer(ForgotPassword);
