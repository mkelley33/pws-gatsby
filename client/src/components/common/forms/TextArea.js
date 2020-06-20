import React from 'react';
import classnames from 'classnames';
import { useField } from 'formik';

import Label from './Label';
import InputFeedback from './InputFeedback';

const TextArea = ({ label, className, error, ...props }) => {
  const [field, meta] = useField(props);

  const classes = classnames(
    'form-group',
    {
      'animated shake error': !!error,
    },
    className
  );
  return (
    <div className={classes}>
      <Label className="sr-only" htmlFor={id} error={error}>
        {label}
      </Label>
      <textarea className="form-control" {...field} {...props} />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextArea;
