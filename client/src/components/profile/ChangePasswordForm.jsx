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
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <KeyRound className={`w-5 h-5 ${errorMsg ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
        </div>
        <input
          id={id}
          type={showState ? 'text' : 'password'}
          {...registerProps}
          className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-zinc-800/50 border ${
            errorMsg 
              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500' 
              : 'border-gray-200 dark:border-zinc-700 focus:ring-orange-500/20 focus:border-orange-500'
          } text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:outline-none transition-all duration-200`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowState(!showState)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
        >
          {showState ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {errorMsg && (
        <p className="text-sm font-medium text-red-500 mt-1.5 animate-in slide-in-from-top-1">
          {errorMsg}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="p-2.5 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-900/30">
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Security Settings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Keep your account secure by updating your password.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="relative z-10 space-y-6">
        
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
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ChangePasswordForm;
