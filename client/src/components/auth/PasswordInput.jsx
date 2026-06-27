import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable Password Input Component
 * 
 * We use React.forwardRef here so that this component can seamlessly integrate 
 * with `react-hook-form`'s `register` function.
 * 
 * @param {string} className - Optional custom classes
 * @param {boolean} error - Whether to show the error state styling
 * @param {object} props - Any other standard input HTML props (placeholder, name, etc.)
 */
const PasswordInput = forwardRef(({ className = '', error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        // Dynamically change type based on state
        type={showPassword ? 'text' : 'password'}
        className={`
          w-full px-4 py-3 
          bg-gray-50 dark:bg-zinc-900/50 
          border ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-zinc-800'} 
          rounded-xl 
          text-gray-900 dark:text-white 
          placeholder-gray-400 dark:placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
          transition-colors 
          pr-12 
          ${className}
        `}
        {...props}
      />
      
      {/* Show/Hide Toggle Button */}
      <button
        type="button"
        onClick={togglePasswordVisibility}
        // Accessibility attribute so screen readers know what this button does
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="
          absolute right-3 top-1/2 -translate-y-1/2 p-1.5 
          text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 
          rounded-lg 
          transition-colors 
          focus:outline-none focus:ring-2 focus:ring-orange-500/50
        "
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Eye className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

// Setting displayName is good practice when using forwardRef
PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
