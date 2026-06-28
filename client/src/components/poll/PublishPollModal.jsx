import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar as CalendarIcon, Clock, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PublishPollModal = ({ isOpen, onClose, onConfirm, isPublishing, pollTitle }) => {
  const [publishType, setPublishType] = useState('now'); // 'now' or 'schedule'
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleConfirm = () => {
    if (publishType === 'schedule') {
      if (!scheduledDate || !scheduledTime) return;
      const dateTimeString = `${scheduledDate}T${scheduledTime}`;
      onConfirm({ scheduledPublishDate: new Date(dateTimeString).toISOString() });
    } else {
      onConfirm({}); // Publish immediately
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isPublishing ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Publish Poll</h3>
              <button
                onClick={onClose}
                disabled={isPublishing}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  You are about to publish:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  "{pollTitle}"
                </p>
              </div>

              {/* Publish Type Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPublishType('now')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    publishType === 'now'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-gray-400 hover:border-orange-200 dark:hover:border-zinc-700'
                  }`}
                >
                  <Globe className="w-6 h-6" />
                  <span className="font-semibold text-sm">Publish Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPublishType('schedule')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    publishType === 'schedule'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-gray-400 hover:border-indigo-200 dark:hover:border-zinc-700'
                  }`}
                >
                  <CalendarIcon className="w-6 h-6" />
                  <span className="font-semibold text-sm">Schedule</span>
                </button>
              </div>

              {/* Schedule Inputs */}
              {publishType === 'schedule' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPublishing}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPublishing || (publishType === 'schedule' && (!scheduledDate || !scheduledTime))}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-sm ${
                  publishType === 'schedule'
                    ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25'
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-orange-500/25'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : publishType === 'schedule' ? (
                  'Schedule Publish'
                ) : (
                  'Publish Now'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default PublishPollModal;
