import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', loading, disabled, className = '', ...rest
}) => {
  const base = variant === 'primary' ? 'btn-primary'
    : variant === 'secondary' ? 'btn-secondary'
    : variant === 'danger' ? 'btn-danger'
    : 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-ink-muted text-sm hover:bg-surface-200 transition-colors';
  const sz = size === 'sm' ? 'text-xs px-3 py-1.5' : '';
  return (
    <button {...rest} disabled={disabled || loading} className={`${base} ${sz} ${className}`}>
      {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
};
export default Button;
