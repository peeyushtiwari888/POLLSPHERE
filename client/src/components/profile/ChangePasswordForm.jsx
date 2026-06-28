import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ShieldAlert, KeyRound, Eye, EyeOff } from 'lucide-react';

// Zod validation schema for changing passwords
const passwordSchema = z.object({
  currentPassword: z.string()
    .nonempty('Current password is required'),
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters long')
    .max(50, 'Password cannot exceed 50 characters'),
  confirmPassword: z.string()
    .nonempty('Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Applies the error specifically to the confirmPassword field
});

/**
 * Change Password Form
 * 
 * Secure form to allow the user to update their account password.
 * Includes inline validation, password visibility toggles, and secure masking.
 * 
 * @param {Function} onSubmit - Form submission handler passed from parent
 * @param {boolean} isSubmitting - Loading state passed from parent
 */
const ChangePasswordForm = ({ onSubmit, isSubmitting }) => {
  // Visibility toggle states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Local submission wrapper
  const handleFormSubmit = async (data) => {
    // We execute the parent's onSubmit which contains the actual API logic and toast notifications
    if (onSubmit) {
      try {
        await onSubmit({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        
        // If successful, wipe the form completely clean
        reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Also reset visibility toggles for security
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      } catch (error) {
        // Parent caught and toasted the error, no extra action needed here
      }
    }
  };

  // Reusable password input renderer
  const renderPasswordInput = (id, label, placeholder, registerProps, errorMsg, showState, setShowState) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showState ? 'text' : 'password'}
          {...registerProps}
          className={`w-full px-4 pr-12 py-2.5 bg-transparent border-b ${
            errorMsg 
              ? 'border-red-500' 
              : 'border-gray-300 dark:border-zinc-700 focus:border-gray-900 dark:focus:border-white'
          } text-gray-900 dark:text-white focus:outline-none transition-colors`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowState(!showState)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showState ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {errorMsg && (
        <p className="text-sm font-medium text-red-500 mt-1.5">
          {errorMsg}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Security Settings
        </h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Form Fields */}
        {renderPasswordInput(
          'currentPassword',
          'Current Password',
          'Enter current password',
          register('currentPassword'),
          errors.currentPassword?.message,
          showCurrent,
          setShowCurrent
        )}

        {renderPasswordInput(
          'newPassword',
          'New Password',
          'Must be at least 6 characters',
          register('newPassword'),
          errors.newPassword?.message,
          showNew,
          setShowNew
        )}

        {renderPasswordInput(
          'confirmPassword',
          'Confirm New Password',
          'Type new password again',
          register('confirmPassword'),
          errors.confirmPassword?.message,
          showConfirm,
          setShowConfirm
        )}

        {/* Submit Button */}
        <div className="pt-2 flex">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </button>
        </div>

      </form>
    </div>
  );
};

export default ChangePasswordForm;
