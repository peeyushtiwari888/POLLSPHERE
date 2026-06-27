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
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="p-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
          <Settings2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Personal Information
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update your basic profile details here.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Full Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={`w-5 h-5 ${errors.name ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
            </div>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border ${
                errors.name 
                  ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500' 
                  : 'border-gray-200 dark:border-zinc-700 focus:ring-orange-500/20 focus:border-orange-500'
              } text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:outline-none transition-all duration-200`}
              placeholder="e.g. John Doe"
            />
          </div>
          {errors.name && (
            <p className="text-sm font-medium text-red-500 mt-1.5 animate-in slide-in-from-top-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input (Read-Only) */}
        <div className="space-y-2 opacity-70">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
            <span>Email Address</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">Read Only</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              value={profile?.email || ''}
              readOnly
              className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 rounded-xl cursor-not-allowed focus:outline-none"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Your email address is used for authentication and cannot be changed here.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileForm;
