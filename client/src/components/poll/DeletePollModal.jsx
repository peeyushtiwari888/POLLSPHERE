import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, X } from 'lucide-react';

/**
 * Delete Poll Modal
 * 
 * A reusable, premium confirmation dialog for destructive actions.
 * Handles loading states and prevents accidental clicks while submitting.
 */
const DeletePollModal = ({ isOpen, onClose, onConfirm, isDeleting = false, pollTitle = 'this poll' }) => {
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
            onClick={() => !isDeleting && onClose()}
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
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close Button (Top Right) */}
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header & Warning Icon */}
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 border-4 border-red-100 dark:border-red-900/30 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                Delete Poll?
              </h2>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-1">
                Are you absolutely sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300 truncate inline-block max-w-[200px] align-bottom">"{pollTitle}"</span>?
              </p>
              <p className="text-red-500 text-sm font-medium">
                This action cannot be undone. All responses will be permanently lost.
              </p>
            </div>

            {/* Actions Footer */}
            <div className="bg-gray-50/50 dark:bg-zinc-950/50 px-6 py-5 sm:px-8 flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="w-full sm:w-auto flex-1 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Poll'
                )}
              </button>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};

export default DeletePollModal;
