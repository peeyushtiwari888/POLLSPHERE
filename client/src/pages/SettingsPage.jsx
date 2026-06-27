import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Mail 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import ThemeSettings from '../components/profile/ThemeSettings';
import DangerZone from '../components/profile/DangerZone';


/**
 * Settings Page
 * 
 * Provides global application settings for the user including UI theme,
 * notification preferences, and the destructive Danger Zone.
 */
const SettingsPage = () => {
  // Local state for mock preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  const handleToggleEmail = () => {
    setEmailNotifs(!emailNotifs);
    toast.success(`Email notifications ${!emailNotifs ? 'enabled' : 'disabled'}`);
  };

  const handleToggleMarketing = () => {
    setMarketingNotifs(!marketingNotifs);
    toast.success(`Marketing emails ${!marketingNotifs ? 'enabled' : 'disabled'}`);
  };

  // ---------------------------------------------------------------------------
  // REUSABLE TOGGLE COMPONENT
  // ---------------------------------------------------------------------------
  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
        enabled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-zinc-700'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* --------------------------------------------------------
          Header Section
      -------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
              <Settings className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Settings
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">
            Customize your app experience, manage notifications, and control your account.
          </p>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* --------------------------------------------------------
            Theme Settings
        -------------------------------------------------------- */}
        <ThemeSettings />

        {/* --------------------------------------------------------
            Account Preferences (Notifications)
        -------------------------------------------------------- */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage how we communicate with you.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Alerts
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Receive emails when your polls hit milestones.</span>
              </div>
              <ToggleSwitch enabled={emailNotifs} onChange={handleToggleEmail} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white">Marketing Emails</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Receive tips, newsletters, and promotional offers.</span>
              </div>
              <ToggleSwitch enabled={marketingNotifs} onChange={handleToggleMarketing} />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            Danger Zone
        -------------------------------------------------------- */}
        <DangerZone />

      </div>
    </div>
  );
};

export default SettingsPage;
