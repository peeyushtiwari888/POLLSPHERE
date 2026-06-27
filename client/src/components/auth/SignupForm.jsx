import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '../../api/auth.api';
import { Mail, User, Loader2 } from 'lucide-react';
import AuthCard from './AuthCard';
import PasswordInput from './PasswordInput';

/**
 * Validation Schema using Zod
 * Ensures all fields meet basic SaaS requirements and passwords match.
 */
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Premium Signup Form Component (UI Only)
 */
const SignupForm = () => {
  const navigate = useNavigate();

  // Setup React Hook Form with Zod integration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data) => {
    try {
      // Call the signup API endpoint
      await authApi.signup({
        username: data.name,
        email: data.email,
        password: data.password,
      });
      
      toast.success('Account created successfully! Please log in.');
      
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <AuthCard>
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Create an account
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Join PollSphere and start creating smarter polls
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Full Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name')}
              type="text"
              autoComplete="name"
              className={`
                w-full pl-11 pr-4 py-3 
                bg-gray-50 dark:bg-zinc-900/50 
                border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'} 
                rounded-xl 
                text-gray-900 dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
                transition-colors
              `}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={`
                w-full pl-11 pr-4 py-3 
                bg-gray-50 dark:bg-zinc-900/50 
                border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'} 
                rounded-xl 
                text-gray-900 dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
                transition-colors
              `}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <PasswordInput
            {...register('password')}
            error={errors.password}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Confirm Password
          </label>
          <PasswordInput
            {...register('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full flex justify-center items-center py-3 px-4 mt-6
            border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] 
            text-sm font-medium text-white 
            bg-orange-500 hover:bg-orange-600 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-zinc-900
            disabled:opacity-70 disabled:cursor-not-allowed 
            transition-all duration-200 active:scale-[0.98]
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>

        {/* Or Divider */}
        <div className="mt-6 pt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-[#18181b] text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google OAuth Button Placeholder (UI Only) */}
        <motion.button
          type="button"
          onClick={() => toast('Google Sign-In coming soon')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full flex justify-center items-center py-3 px-4 mt-4
            border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm 
            text-sm font-medium text-gray-700 dark:text-gray-200 
            bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/80 
            transition-colors 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-offset-zinc-900
          "
        >
          {/* Official Google SVG Icon */}
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </motion.button>
      </form>

      {/* Footer Link */}
      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          Log in
        </Link>
      </p>

    </AuthCard>
  );
};

export default SignupForm;
