import React, { useState } from 'react';
import { Globe, Lock, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// We import the API function. If it's named publishPoll in the API file, we can alias it here.
import { publishPoll as publishPollResults } from '../../api/poll.api';

/**
 * Publish Results Card Component
 * 
 * Allows the poll creator to make the analytics dashboard visible to the public.
 * Handles the complete publishing flow including a confirmation modal, loading states, 
 * and toast notifications.
 * 
 * @param {string} pollId - The ID of the current poll
 * @param {boolean} isPublished - Current published status of the poll
 */
const PublishResultsCard = ({ pollId, isPublished: initialPublishedStatus = false }) => {
  const [isPublished, setIsPublished] = useState(initialPublishedStatus);
  const [showModal, setShowModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // ---------------------------------------------------------------------------
  // PUBLISH FLOW HANDLER
  // ---------------------------------------------------------------------------
  const handlePublishConfirm = async () => {
    try {
      setIsPublishing(true);
      
      // Call the API endpoint to update the poll's isResultsPublished flag
      await publishPollResults(pollId, { isResultsPublished: true });
      
      // Update local state to reflect the new status
      setIsPublished(true);
      
      // Show success notification
      toast.success('Poll results are now public!');
      
      // Close modal
      setShowModal(false);
    } catch (error) {
      // Handle and display error
      toast.error(error.message || 'Failed to publish poll results.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      {/* ----------------------------------------------------------------------
          Main Card UI
      ---------------------------------------------------------------------- */}
      <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group transition-all duration-300">
        
        {/* Subtle Background Accent */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -mr-10 -mt-10 transition-colors duration-500 ${isPublished ? 'bg-purple-500' : 'bg-gray-500'}`} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-xl border ${isPublished ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-900/30' : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'}`}>
              {isPublished ? (
                <Globe className={`w-5 h-5 ${isPublished ? 'text-purple-500' : 'text-gray-500'}`} />
              ) : (
                <Lock className={`w-5 h-5 ${isPublished ? 'text-purple-500' : 'text-gray-500'}`} />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Visibility
            </h3>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {isPublished 
                ? 'The results of this poll are currently visible to anyone with the link. They can view the analytics dashboard.'
                : 'Results are currently private. Only you can view this analytics dashboard. Publish to share with your audience.'}
            </p>
          </div>

          {/* Action Button */}
          {isPublished ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold rounded-xl border border-purple-100 dark:border-purple-500/20">
              <CheckCircle2 className="w-4 h-4" />
              Results Published
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm active:scale-95"
            >
              Publish Results
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          Confirmation Modal (Framer Motion)
      ---------------------------------------------------------------------- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPublishing && setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                
                {/* Warning Icon */}
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-4 border border-orange-100 dark:border-orange-500/20">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Publish Poll Results?
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  By publishing, anyone with the link to this poll will be able to see the live analytics dashboard. 
                  <br /><br />
                  Are you sure you want to make this data public?
                </p>

                {/* Actions */}
                <div className="w-full flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isPublishing}
                    className="flex-1 py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublishConfirm}
                    disabled={isPublishing}
                    className="flex-1 py-3 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Yes, Publish'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublishResultsCard;
