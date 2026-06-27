import React from 'react';
import { Calendar, Clock, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Step 3: Poll Settings
 * 
 * Configures the behavior, privacy, and lifecycle of the poll.
 */
const PollSettingsStep = ({ data = {}, updateData }) => {
  
  // Safe defaults if data is missing
  const settings = {
    isAnonymous: false,
    requireAuth: false,
    expiryDate: '',
    expiryTime: '',
    ...data
  };

  const handleChange = (field, value) => {
    updateData({ ...settings, [field]: value });
  };

  // Helper to render premium toggles
  const SettingToggle = ({ title, description, icon: Icon, field, checked }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl hover:border-orange-500/50 transition-colors shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-xl flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            {description}
          </p>
        </div>
      </div>
      
      {/* Custom CSS Toggle Switch */}
      <label className="flex items-center cursor-pointer flex-shrink-0 ml-12 sm:ml-0 mt-2 sm:mt-0">
        <input 
          type="checkbox" 
          className="sr-only"
          checked={checked}
          onChange={(e) => handleChange(field, e.target.checked)}
        />
        <div className={`w-14 h-7 rounded-full transition-colors duration-300 ease-in-out relative shadow-inner ${
          checked ? 'bg-orange-500' : 'bg-gray-200 dark:bg-zinc-700'
        }`}>
          <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${
            checked ? 'translate-x-7' : 'translate-x-0'
          }`}></div>
        </div>
      </label>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-8">
      
      {/* Header */}
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Configure privacy rules and poll lifecycle.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* --------------------------------------------------------
            Privacy Settings
        -------------------------------------------------------- */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-gray-900 dark:text-white uppercase px-1">
            Privacy & Access
          </h3>
          <div className="space-y-4">
            <SettingToggle 
              title="Require Authentication"
              description="Voters must be logged into PollSphere to cast a vote. Prevents spam."
              icon={Shield}
              field="requireAuth"
              checked={settings.requireAuth}
            />
            <SettingToggle 
              title="Anonymous Responses"
              description="Hide voter identities. Responses will not be linked to user profiles."
              icon={UserCheck}
              field="isAnonymous"
              checked={settings.isAnonymous}
            />
          </div>
        </section>

        {/* --------------------------------------------------------
            Lifecycle Settings (Expiry)
        -------------------------------------------------------- */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 dark:text-white uppercase">
              Poll Expiry
            </h3>
            <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            
            <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-800 dark:text-blue-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">
                If you leave these fields empty, your poll will remain active indefinitely until you manually close it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    value={settings.expiryDate}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    className="w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  End Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <input
                    type="time"
                    value={settings.expiryTime}
                    onChange={(e) => handleChange('expiryTime', e.target.value)}
                    disabled={!settings.expiryDate} // Only allow time if date is set
                    className={`w-full h-12 pl-11 pr-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      !settings.expiryDate 
                        ? 'bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500/20'
                    }`}
                  />
                </div>
                {!settings.expiryDate && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Select a date first.</p>
                )}
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PollSettingsStep;
