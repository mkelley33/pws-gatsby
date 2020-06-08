import React from 'react';

const Label = ({ error, className, children, ...props }) => {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
};

export default Label;
