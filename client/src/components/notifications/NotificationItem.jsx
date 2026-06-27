import React from 'react';
import { CheckCircle2, MessageSquare, AlertCircle, Share2, PlusCircle, Check } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIconConfig = (type) => {
    switch (type) {
      case 'POLL_CREATED':
        return { icon: PlusCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' };
      case 'POLL_PUBLISHED':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' };
      case 'RESPONSE_RECEIVED':
        return { icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' };
      case 'POLL_EXPIRED':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' };
      case 'POLL_SHARED':
        return { icon: Share2, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' };
      default:
        return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-500/10' };
    }
  };

  const { icon: Icon, color, bg } = getIconConfig(notification.type);

  return (
    <div 
      className={`relative group flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-gray-100 dark:border-zinc-800/50 last:border-0 ${!notification.isRead ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
    >
      {/* Unread Indicator Dot */}
      {!notification.isRead && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <p className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {notification.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
          {notification.timeAgo}
        </p>
      </div>

      {/* Quick Action: Mark as read (appears on hover) */}
      {!notification.isRead && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead(notification.id);
          }}
          className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          title="Mark as read"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
