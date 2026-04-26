import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button {...rest} className={`px-3 py-1 rounded bg-primary text-white ${className}`}>{children}</button>
);

export default Button;