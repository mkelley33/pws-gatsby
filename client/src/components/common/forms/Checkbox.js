import React from 'react';

const Checkbox = ({
  field: { name, onChange },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div>
      <input
        name={name}
        id={id}
        type="checkbox"
        value={props.value}
        onChange={onChange}
        defaultChecked={props.defaultChecked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;