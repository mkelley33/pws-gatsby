import React from 'react';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { navigate } from 'gatsby';

import TextInput from '@components/common/forms/TextInput';
import api from '../api';
import Layout from '@components/layout';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password has to be at least 8 characters!')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password confirm is required'),
  }),
  mapPropsToValues: () => ({
    password: '',
    confirmPassword: '',
  }),
  handleSubmit: (payload, { setSubmitting, setErrors, props }) => {
    api.post('/auth/reset-password', Object.assign(payload, { token: props.token })).then(res => {
      navigate('/post-reset-password');
    });
    setSubmitting(false);
  },
  displayName: 'ResetPasswordForm',
});

const ResetPasswordForm = props => {
  document.title = 'Reset Password Form';
  const { values, touched, errors, dirty, handleChange, handleBlur, handleSubmit, isSubmitting } = props;

  return (
    <Layout>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <TextInput
          id="password"
          type="password"
          label="Password"
          error={touched.password && errors.password}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
        />
        <TextInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          error={touched.confirmPassword && errors.confirmPassword}
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="confirm-password"
        />
        <button type="submit" disabled={!dirty || isSubmitting} className="btn btn-primary">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default formikEnhancer(ResetPasswordForm);
