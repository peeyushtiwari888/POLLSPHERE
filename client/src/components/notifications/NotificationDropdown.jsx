import React from 'react';
import { Loader2, Bell, CheckCircle2 } from 'lucide-react';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ 
  notifications, 
  isLoading, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClose 
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 transform origin-top-right transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
              {unreadCount} new
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button 
            onClick={onMarkAllAsRead}
            className="text-xs font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium mb-1">All caught up!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">You have no new notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800/50">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-center">
          <button 
            onClick={onClose}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
