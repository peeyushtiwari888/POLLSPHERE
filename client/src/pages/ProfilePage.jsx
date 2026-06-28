import React, { useState, useEffect, Suspense } from 'react';
import { Loader2, AlertCircle, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

// API Functions
import { getProfile, updateProfile, changePassword } from '../api/profile.api';
import GlobalLoader from '../components/common/GlobalLoader';

// Child Components (To be implemented later)
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';

/**
 * Profile Settings Page
 * 
 * Central hub for managing user account details and security.
 * Follows a clean Bento-box grid layout. All API logic and state 
 * management is hoisted here to keep the child components pure.
 */
const ProfilePage = () => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Loading states for individual forms to prevent multi-submissions
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data?.user || data || null); // Handle payload wrapper flexibly
    } catch (err) {
      setError(err.message || 'Failed to load your profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  
  /**
   * Handles submitting the Profile Details form
   */
  const handleUpdateProfile = async (formData) => {
    try {
      setIsUpdatingProfile(true);
      const data = await updateProfile(formData);
      
      // Update local state smoothly without full reload
      if (data?.user) setProfile(data.user);
      else setProfile({ ...profile, ...formData });
      
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
      throw err; // Re-throw so the child form can catch it if needed
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**
   * Handles submitting the Change Password form
   */
  const handleChangePassword = async (passwordData) => {
    try {
      setIsChangingPassword(true);
      await changePassword(passwordData);
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
      throw err; // Re-throw so the child form can display inline errors if needed
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return <GlobalLoader text="Loading your profile..." />;
  }

  // ---------------------------------------------------------------------------
  // RENDER: ERROR STATE
  // ---------------------------------------------------------------------------
  if (error || !profile) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Failed to load profile
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          {error || 'An unexpected error occurred while loading your profile.'}
        </p>
        <button 
          onClick={fetchProfileData}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN DASHBOARD LAYOUT
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* --------------------------------------------------------
          Header Section
      -------------------------------------------------------- */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information and security.
        </p>
      </div>

      {/* --------------------------------------------------------
          Bento-Box Grid Layout
      -------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* Left Column (Sticky User Card - Takes up 1/3 width on desktop) */}
        <div className="lg:col-span-1 lg:sticky lg:top-8">
          <Suspense fallback={<div className="h-64 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <ProfileCard profile={profile} />
          </Suspense>
        </div>

        {/* Right Column (Forms - Takes up 2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Personal Information Form */}
          <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <ProfileForm 
              profile={profile} 
              onSubmit={handleUpdateProfile} 
              isSubmitting={isUpdatingProfile} 
            />
          </Suspense>
          
          {/* Security / Password Form */}
          <Suspense fallback={<div className="h-80 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <ChangePasswordForm 
              onSubmit={handleChangePassword} 
              isSubmitting={isChangingPassword} 
            />
          </Suspense>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
