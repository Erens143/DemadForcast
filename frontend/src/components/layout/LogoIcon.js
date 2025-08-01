import React from 'react';

const LogoIcon = ({ className = "w-8 h-8", size = "default" }) => {
  const iconSizes = {
    small: "w-6 h-6",
    default: "w-8 h-8", 
    large: "w-12 h-12"
  };

  return (
    <svg 
      className={`${iconSizes[size]} ${className}`}
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="15" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>
      
      {/* Chart bars */}
      <rect x="8" y="18" width="3" height="8" fill="white" rx="1"/>
      <rect x="12" y="14" width="3" height="12" fill="white" rx="1"/>
      <rect x="16" y="10" width="3" height="16" fill="white" rx="1"/>
      <rect x="20" y="12" width="3" height="14" fill="white" rx="1"/>
      
      {/* Trend line */}
      <path 
        d="M6 22 L10 18 L14 20 L18 16 L22 18 L26 14" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Dot on trend line */}
      <circle cx="18" cy="16" r="1.5" fill="white"/>
    </svg>
  );
};

export default LogoIcon; 