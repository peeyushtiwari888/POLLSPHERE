import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthCard from './AuthCard';
import PasswordInput from './PasswordInput';

/**
 * Validation Schema using Zod
 * This ensures data is validated on the client side before hitting the API.
 */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

/**
 * Premium Login Form Component
 */
const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Setup React Hook Form with Zod integration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });



  /**
   * Handle form submission
   */
  const onSubmit = async (data) => {
    try {
      // Call the global login function from our AuthContext
      await login({ email: data.email, password: data.password });
      
      toast.success('Welcome back!');
      
      // Smart Redirect: Send user to the page they were trying to visit, 
      // or default to the dashboard.
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      // Display the cleanly formatted error message from our API layer
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    // We wrap everything in the reusable AuthCard we created earlier
    <AuthCard>
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Welcome back
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your details to access your account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
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
          {/* Using our reusable PasswordInput component */}
          <PasswordInput
            {...register('password')}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Actions Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <input
              {...register('rememberMe')}
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-orange-500 focus:ring-orange-500/50 border-gray-300 rounded cursor-pointer bg-gray-50 dark:bg-zinc-900/50 dark:border-zinc-800"
            />
            <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full flex justify-center items-center py-3 px-4 mt-2
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
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>


      </form>

      {/* Footer Link */}
      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          Sign up for free
        </Link>
      </p>

    </AuthCard>
  );
};

export default LoginForm;
