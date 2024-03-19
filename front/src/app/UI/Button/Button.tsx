import React, { ButtonHTMLAttributes } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Add any additional props if needed
  className?: string;
  type?: 'button' | 'submit'| 'reset';
  onClick?: () => void; 
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    // className={`${classes.button} ${props.className || ''}`}
    <button
      className={props.className}
      type={props.type || 'button'}      
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;