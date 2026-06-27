import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPassword } from '../api/auth.api';
import AuthCard from '../components/auth/AuthCard';
import PasswordInput from '../components/auth/PasswordInput';

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password);
      setSuccess(true);
      toast.success("Password reset successfully. You can now login.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. The link might be invalid or expired.');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#09090b] p-4">
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Set New Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              New Password
            </label>
            <PasswordInput
              {...register('password')}
              error={errors.password}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm New Password
            </label>
            <PasswordInput
              {...register('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

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

export default ResetPasswordPage;
