import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md', className = '',
}) => {
  const s = size === 'sm' ? 'w-5 h-5 border-2' : size === 'lg' ? 'w-12 h-12 border-4' : 'w-8 h-8 border-3';
  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <div className={`${s} border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  );
};
export default LoadingSpinner;
