import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      id: 'light',
      label: 'Light Mode',
      icon: Sun,
      description: 'Clear and bright appearance'
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: Moon,
      description: 'Easy on the eyes in low light'
    },
    {
      id: 'system',
      label: 'System Theme',
      icon: Monitor,
      description: 'Adapts to your device settings'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize the theme of your application.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setTheme(option.id)}
              className={clsx(
                'relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left',
                isActive 
                  ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-900/20 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              )}
            >
              <div 
                className={clsx(
                  'p-3 rounded-full mb-4 transition-colors',
                  isActive 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <div className="text-center">
                <h4 className={clsx(
                  'font-semibold mb-1',
                  isActive ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-gray-100'
                )}>
                  {option.label}
                </h4>
                <p className={clsx(
                  'text-xs',
                  isActive ? 'text-indigo-700/80 dark:text-indigo-300/80' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {option.description}
                </p>
              </div>
              
              {isActive && (
                <div className="absolute top-4 right-4">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSettings;
