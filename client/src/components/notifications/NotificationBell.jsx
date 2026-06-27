import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

// Mock Data for frontend UI demonstration
const mockNotifications = [
  {
    id: '1',
    type: 'POLL_PUBLISHED',
    title: 'Poll Published Successfully',
    message: 'Your poll "Favorite Programming Language" is now live.',
    isRead: false,
    timeAgo: '2m ago'
  },
  {
    id: '2',
    type: 'RESPONSE_RECEIVED',
    title: 'New Response',
    message: 'Someone just responded to your poll "Lunch Options".',
    isRead: false,
    timeAgo: '1h ago'
  },
  {
    id: '3',
    type: 'POLL_EXPIRED',
    title: 'Poll Expired',
    message: 'Your poll "Weekend Trip Destination" has ended.',
    isRead: true,
    timeAgo: '1d ago'
  },
];

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Mock UI Interactions
  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // Simulate initial loading state if opening
    if (!isOpen && notifications.length > 0) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500); // 500ms mock delay
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <Bell className="w-5 h-5" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-zinc-900 rounded-full" />
        )}
      </button>

      {/* Dropdown Container */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
