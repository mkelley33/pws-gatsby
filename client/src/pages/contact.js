import React, { useEffect, useRef } from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';

import Layout from '@components/layout';
import api from '../api';
import TextInput from '@components/common/forms/TextInput';
import TextArea from '@components/common/forms/TextArea';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    firstName: Yup.string().min(2, "C'mon, your first name is longer than that").required('First name is required'),
    lastName: Yup.string().min(2, "C'mon, your last name is longer than that").required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    message: Yup.string().required('Message is required'),
    recaptcha: Yup.string().required(),
  }),
  handleSubmit: (payload, { setSubmitting }) => {
    api
      .post(`/contact`, payload, {
        withCredentials: true,
      })
      .then(res => {
        navigate('/post-contact');
      })
      .catch(err => {
        toast.error('Something went wrong', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
        });
      });
    setSubmitting(false);
  },
  mapPropsToValues: () => ({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    recaptcha: '',
  }),
  displayName: 'ContactForm',
});

const ContactForm = props => {
  const tokenEl = useRef(null);

  document.title = 'Contact Form';
  const { values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = props;

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    window.onSubmit = token => {
      api.post('/recaptcha', { token }).then(res => {
        if (res.data.error) {
          setFieldValue('recaptcha', '');
        } else {
          setFieldValue('recaptcha', token);
        }
      });
    };
    window.onExpired = () => setFieldValue('recaptcha', '');
    document.body.appendChild(script);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Layout>
      <section>
        <h1>Contact</h1>
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
          <TextArea
            id="message"
            label="Message"
            error={touched.message && errors.message}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={6}
          />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input id="recaptcha" name="recaptcha" type="hidden" ref={tokenEl} value="" />
          <div className="form-group">
            <div
              className="g-recaptcha"
              data-sitekey={process.env.RECAPTCHA_SITE_KEY}
              data-callback="onSubmit"
              data-expired-callback="onExpired"
            ></div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            Submit
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default formikEnhancer(ContactForm);
