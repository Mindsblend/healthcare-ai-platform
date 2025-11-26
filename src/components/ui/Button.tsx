import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-md bg-blue-600 text-black font-semibold hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
