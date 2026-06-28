import React from 'react';
import { Users, UserCheck, Shield } from 'lucide-react';

/**
 * Participation Demographics Card
 * 
 * Shows the breakdown of anonymous vs authenticated responses.
 */
const ParticipationCard = ({ stats }) => {
  const safeStats = stats || {};
  const {
    totalResponses = 0,
    anonymousResponses = 0,
    authenticatedResponses = 0
  } = safeStats;

  const authPercentage = totalResponses === 0 ? 0 : Math.round((authenticatedResponses / totalResponses) * 100);
  const anonPercentage = totalResponses === 0 ? 0 : Math.round((anonymousResponses / totalResponses) * 100);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Participation
        </h3>
      </div>

      <div className="space-y-6">
        {/* Authenticated */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              Authenticated
            </div>
            <span className="text-gray-900 dark:text-white">{authPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${authPercentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 text-right">{authenticatedResponses} users</span>
        </div>

        {/* Anonymous */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Shield className="w-4 h-4 text-gray-400" />
              Anonymous
            </div>
            <span className="text-gray-900 dark:text-white">{anonPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
            <div 
              className="bg-gray-400 dark:bg-gray-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${anonPercentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 text-right">{anonymousResponses} users</span>
        </div>
      </div>
    </div>
  );
};

export default ParticipationCard;
