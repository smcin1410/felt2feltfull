import React from 'react';

// Define the props for the Button component
// It accepts all standard HTML button attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  // Base classes for the button style
  const baseClasses = 
    'bg-accent-hotpink text-text-primary font-bold py-2 px-6 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-neon focus:ring-offset-2 focus:ring-offset-background';

  // Combine base classes with any custom classes passed in via props
  const combinedClasses = `${baseClasses} ${className || ''}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;