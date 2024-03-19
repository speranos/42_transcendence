import React, { ChangeEvent } from 'react';

// style
// import classes from './Input.module.css';

interface InputProps {
  type: string;
  id: string;
  label: string;
  value: string;
  isValid?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = (props) => {
  return (
    // className={`${classes.control} ${props.isValid === false ? classes.invalid : ''}`}
    <div >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
};

export default Input;
