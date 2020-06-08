import React from 'react';

const InputFeedback = ({ error }) =>
  error ? <div className="invalid-feedback">{error}</div> : null;

export default InputFeedback;
