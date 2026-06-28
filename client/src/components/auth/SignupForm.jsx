import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '../../api/auth.api';
import { Mail, User, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
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
  const { loginWithGoogle } = useAuth();

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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Google login failed');
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

        {/* Google OAuth Button */}
        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google login failed');
            }}
            useOneTap
            shape="rectangular"
            theme="outline"
            text="signup_with"
            size="large"
          />
        </div>
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
