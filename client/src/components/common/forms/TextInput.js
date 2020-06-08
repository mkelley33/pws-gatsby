import React from 'react';
import classnames from 'classnames';

import Label from './Label';
import InputFeedback from './InputFeedback';

const TextInput = ({ type, id, label, error, value, onChange, className, ...props }) => {
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
      <input
        id={id}
        className="form-control"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        {...props}
      />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextInput;
