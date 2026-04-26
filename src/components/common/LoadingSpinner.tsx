import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-4 border-primary border-dashed rounded-full animate-spin" />
  </div>
);

export default LoadingSpinner;