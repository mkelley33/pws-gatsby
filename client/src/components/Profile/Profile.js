import React from 'react';
import { withFormik } from 'formik';
import { toast } from 'react-toastify';
import { Field } from 'formik';
import * as Yup from 'yup';
import compact from 'lodash/compact';

import api from '../../api';
import TextInput from '@components/common/forms/TextInput';
import Checkbox from '@components/common/forms/Checkbox';
import CheckboxGroup from '@components/common/forms/CheckboxGroup';
import styles from './profile.module.css';
import commonStyles from '@components/common/common.module.css';
import ForgotPassword from '../ForgotPassword';
import Modal from '@components/Modal/Modal';
import withAuthentication from '@components/withAuthentication';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    firstName: Yup.string().min(2, "C'mon, your first name is longer than that").required('First name is required'),
    lastName: Yup.string().min(2, "C'mon, your last name is longer than that").required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    currentPassword: Yup.string(),
    password: Yup.string()
      .min(8, 'Password has to be at least 8 characters!')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  }),
  handleSubmit: (payload, { setSubmitting, props }) => {
    // TODO: consider putting user in local storage
    const { user } = props;
    payload.roles = compact(payload.roles);
    api
      .put(`/users/${user.userId}`, payload, {
        withCredentials: true,
      })
      .then(res => {
        toast.success('Your user profile was updated successfully', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
        });
      })
      .catch(err => {
        toast.error('Something went wrong', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
        });
      });
    setSubmitting(false);
  },
  mapPropsToValues: ({ user }) => ({
    ...user,
  }),
  displayName: 'ProfileForm',
});

const Profile = props => {
  const modalProps = {
    triggerText: 'Forgot Password?',
  };

  const modalContent = <ForgotPassword user={{ email: '' }} {...props} />;

  const handleCheckAll = setFieldValue => {
    const inputs = document.getElementsByTagName('input');
    const selectAll = document.querySelector('#selectAll');
    const ids = { admin: 0, user: 1, family: 2, friend: 3 };
    for (const input of inputs) {
      if (Object.keys(ids).includes(input.id)) {
        if (selectAll.checked) {
          input.checked = true;
          setFieldValue(`roles[${ids[input.id]}]`, input.value);
        } else {
          input.checked = false;
          setFieldValue(`roles[${ids[input.id]}]`, '');
        }
      }
    }
  };

  const isAllChecked = () => {
    const inputs = document.getElementsByTagName('input');
    const ids = { admin: 0, user: 1, family: 2, friend: 3 };
    let isAllChecked = false;
    for (const input of inputs) {
      if (Object.keys(ids).includes(input.id)) {
        isAllChecked = input.checked;
        if (!isAllChecked) {
          break;
        }
      }
    }
    return isAllChecked;
  };

  document.title = 'User Profile';
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isAdmin,
    setFieldValue,
  } = props;

  return (
    <React.Fragment>
      <h2>Profile</h2>
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
          autoComplete="username email"
          error={touched.email && errors.email}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="currentPassword"
          type="password"
          label="Current Password"
          autoComplete="current-password"
          error={touched.currentPassword && errors.currentPassword}
          value={values.currentPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className={styles.forgotPassword}>
          <Modal
            modalProps={modalProps}
            modalContent={modalContent}
            modalButtonClassName={commonStyles.modalLinkButton}
            {...props}
          />
        </div>
        <TextInput
          id="password"
          type="password"
          label="New Password"
          autoComplete="new-password"
          error={touched.password && errors.password}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          autoComplete="new-password"
          error={touched.confirmPassword && errors.confirmPassword}
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {isAdmin && (
          <React.Fragment>
            <h3>Roles</h3>
            {/* eslint-disable jsx-a11y/control-has-associated-label */}
            <input
              id="selectAll"
              type="checkbox"
              checked={isAllChecked()}
              onChange={() => handleCheckAll(setFieldValue)}
            />{' '}
            {/* eslint-enable jsx-a11y/control-has-associated-label */}
            <label htmlFor="selectAll">Select all</label>
            <CheckboxGroup
              id="roles"
              className={styles.roles}
              label="Which of these?"
              value={values.roles}
              onChange={setFieldValue}
            >
              <Field
                component={Checkbox}
                name="roles"
                id="admin"
                label="Admin"
                value="admin"
                defaultChecked={values.roles.includes('admin')}
              />
              <Field
                component={Checkbox}
                name="roles"
                id="user"
                label="User"
                value="user"
                defaultChecked={values.roles.includes('user')}
              />
              <Field
                component={Checkbox}
                name="roles"
                id="family"
                label="Family"
                value="family"
                defaultChecked={values.roles.includes('family')}
              />
              <Field
                component={Checkbox}
                name="roles"
                id="friend"
                label="Friend"
                value="friend"
                defaultChecked={values.roles.includes('friend')}
              />
            </CheckboxGroup>
          </React.Fragment>
        )}
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          Submit
        </button>
      </form>
    </React.Fragment>
  );
};

export default withAuthentication(formikEnhancer(Profile));
