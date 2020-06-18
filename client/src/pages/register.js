import React from 'react';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { navigate } from 'gatsby';

import TextInput from '@components/common/forms/TextInput';
import api from '../api';
import Layout from '@components/layout';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    firstName: Yup.string().min(2, "C'mon, your name is longer than that").required('First name is required.'),
    lastName: Yup.string().min(2, "C'mon, your name is longer than that").required('Last name is required.'),
    email: Yup.string().email('Invalid email address').required('Email is required!'),
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
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  }),
  handleSubmit: (payload, { setSubmitting, setErrors, props }) => {
    api
      .post('/users', payload)
      .then((res) => {
        navigate('/post-registration');
      })
      .catch((err) => {
        // Right now this assumes the only back-end error would be duplicate e-mail, and it would, but this should be
        // handled differently, see below.
        // TODO: make API give back error message in JSON instead of a 500 with HTML
        // TODO: figure out if there's a better way to keep error from disappearing after tabbing through fields
        // See https://github.com/jaredpalmer/formik/issues/150
        setErrors({ email: 'That e-mail is already being used' });
      });
    setSubmitting(false);
  },
  displayName: 'RegistrationForm',
});

const RegistrationForm = (props) => {
  document.title = 'Registration Form';
  const { values, touched, errors, dirty, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting } = props;

  return (
    <Layout>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <TextInput
          id="firstName"
          type="text"
          label="First Name"
          error={touched.firstName && errors.firstName}
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="lastName"
          type="text"
          label="Last Name"
          error={touched.lastName && errors.lastName}
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="email"
          type="email"
          label="Email"
          error={touched.email && errors.email}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email username"
        />
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
        <button type="button" className="btn" onClick={handleReset} disabled={!dirty || isSubmitting}>
          Reset
        </button>
        <button type="submit" disabled={!dirty || isSubmitting} className="btn btn-primary">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default formikEnhancer(RegistrationForm);
