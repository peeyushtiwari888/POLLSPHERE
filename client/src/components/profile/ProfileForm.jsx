import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Settings2, User, Mail } from 'lucide-react';

// Zod validation schema for the profile update
const profileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .nonempty('Full name is required'),
});

/**
 * Profile Update Form
 * 
 * Allows users to update their personal information (Name).
 * Email is kept read-only for security (requires separate flow usually).
 * 
 * @param {Object} profile - Current profile data
 * @param {Function} onSubmit - Form submission handler passed from parent
 * @param {boolean} isSubmitting - Loading state passed from parent
 */
const ProfileForm = ({ profile, onSubmit, isSubmitting }) => {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
    },
  });

  // Re-sync default values when the profile data loads asynchronously
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
      });
    }
  }, [profile, reset]);

  // Local submission wrapper
  const handleFormSubmit = async (data) => {
    // The actual API call and toast notifications are handled by the parent
    // to ensure the global profile state updates smoothly across sibling components.
    if (onSubmit) {
      await onSubmit(data);
      // We explicitly reset with the new data to clear the isDirty flag
      reset(data);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Personal Information
        </h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Full Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2.5 bg-transparent border-b ${
                errors.name 
                  ? 'border-red-500' 
                  : 'border-gray-300 dark:border-zinc-700 focus:border-gray-900 dark:focus:border-white'
              } text-gray-900 dark:text-white focus:outline-none transition-colors`}
              placeholder="e.g. John Doe"
            />
          </div>
          {errors.name && (
            <p className="text-sm font-medium text-red-500 mt-1.5">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input (Read-Only) */}
        <div className="space-y-2 opacity-70">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
            <span>Email Address</span>
            <span className="text-xs text-gray-500">(Read Only)</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={profile?.email || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-transparent border-b border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400 cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileForm;
