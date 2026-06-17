import React from 'react';

export default function Loader({ size = 'md', color = 'primary', fullScreen = false }) {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  const spinner = (
    <div className={`spinner-border ${sizeClass} text-${color}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
        style={{ zIndex: 9999, backgroundColor: 'var(--bg-body)', opacity: 0.85 }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      {spinner}
    </div>
  );
}