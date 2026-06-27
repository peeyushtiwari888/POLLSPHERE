import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPassword } from '../api/auth.api';
import AuthCard from '../components/auth/AuthCard';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // In a real app we might show an error, but for security, 
      // often we just pretend it succeeded to prevent email enumeration.
      setIsSubmitted(true);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#09090b] p-4">
      <AuthCard>
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                Reset Password
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We've sent a password reset link to your email address. Please check your inbox.
            </p>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/login" className="inline-flex items-center font-medium text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </p>
      </AuthCard>
    </main>
  );
};

export default ForgotPasswordPage;
