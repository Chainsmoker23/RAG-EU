
import React from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <div className={`animate-spin rounded-full border-4 border-t-eu-blue border-gray-200 ${className}`} role="status">
        <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
