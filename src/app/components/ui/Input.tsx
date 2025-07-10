import React from 'react';

// Define the props for the Input component, extending standard HTML input attributes
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search' | 'filter';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Base classes for the styled input
    const baseClasses =
      'flex h-10 w-full rounded-md border-none bg-gray-800/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary transition-shadow duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-neon';

    // Combine base classes with any custom classes passed via props
    const combinedClasses = `${baseClasses} ${className || ''}`;

    return (
      <input
        type={type}
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export default Input;