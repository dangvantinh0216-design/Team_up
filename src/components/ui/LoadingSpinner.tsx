import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClass = size === 'lg' ? 'spinner-lg' : '';
  
  return (
    <div className={`flex-center p-md ${className}`}>
      <div className={`spinner ${sizeClass}`} />
    </div>
  );
};

export default LoadingSpinner;
