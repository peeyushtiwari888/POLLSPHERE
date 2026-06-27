import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy, Check, Globe, Share } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Share Poll Modal
 * 
 * A premium SaaS modal designed to facilitate distribution of a poll.
 * Generates a public URL and provides one-click copy functionality.
 */
const SharePollModal = ({ isOpen, onClose, pollId }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate the absolute public URL for the poll
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pollsphere.com';
  const publicUrl = `${baseUrl}/polls/${pollId || 'demo-123'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vote on my poll!',
          text: 'Check out this poll and share your opinion.',
          url: publicUrl,
        });
        toast.success('Thanks for sharing!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error('Failed to share natively');
        }
      }
    } else {
      // Fallback to clipboard if Native API is unsupported
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          
          {/* ------------------------------------------------------------------
              Backdrop
          ------------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ------------------------------------------------------------------
              Modal Content
          ------------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            
            {/* Header Area */}
            <div className="p-6 sm:p-8 pb-4">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-500 shadow-sm border border-green-100 dark:border-green-900/30">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 id="share-modal-title" className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Share Poll
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Anyone with this link can view and participate.
                  </p>
                </div>
              </div>

              {/* Public Link Copy Section */}
              <div className="space-y-2 mb-8">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Public Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={publicUrl}
                      className="w-full h-11 pl-4 pr-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-600 dark:text-gray-400 focus:outline-none select-all"
                    />
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-semibold transition-all ${
                      copied 
                        ? 'bg-green-500 text-white shadow-sm' 
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm active:scale-95'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Placeholders / Native Share */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center">
                  Or share via
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={handleNativeShare}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 font-medium transition-colors border border-blue-100 dark:border-blue-900/30 w-full"
                  >
                    <Share className="w-5 h-5" />
                    Share via Device...
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};

export default SharePollModal;
