import React from 'react';
import classnames from 'classnames';

import Label from './Label';
import InputFeedback from './InputFeedback';

const TextArea = ({ label, className, id, error, value, onChange, ...props }) => {
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
      <textarea id={id} className="form-control" value={value} onChange={onChange} placeholder={label} {...props} />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextArea;
