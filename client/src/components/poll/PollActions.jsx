import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit3, BarChart3, Share2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deletePoll } from '../../api/poll.api';
import DeletePollModal from './DeletePollModal';
import SharePollModal from './SharePollModal';

/**
 * Poll Actions Menu
 * 
 * A reusable, premium 3-dot dropdown menu that exposes poll management actions.
 * Contains placeholders for future Modal implementations (Share, Delete).
 */
const PollActions = ({ poll, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (e, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    
    if (actionName === 'Delete') {
      setIsDeleteModalOpen(true);
    } else if (actionName === 'Edit') {
      navigate(`/polls/${poll._id}/edit`);
    } else if (actionName === 'Share') {
      setIsShareModalOpen(true);
    } else {
      console.log(`Action triggered: ${actionName} on poll ${poll?._id}`);
      // Future: trigger Analytics navigation here
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePoll(poll._id);
      toast.success('Poll deleted successfully');
      setIsDeleteModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error.message || 'Failed to delete poll');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
      
      {/* ------------------------------------------------------------------
          Trigger Button
      ------------------------------------------------------------------ */}
      <button
        onClick={toggleMenu}
        aria-label="Open actions menu"
        aria-expanded={isOpen}
        className={`p-2 rounded-xl transition-colors focus:outline-none ${
          isOpen 
            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' 
            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800'
        }`}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* ------------------------------------------------------------------
          Dropdown Menu (Framer Motion)
      ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              
              {/* Primary Actions */}
              <button onClick={(e) => handleAction(e, 'View')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left group">
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                View Poll
              </button>
              
              <button onClick={(e) => handleAction(e, 'Analytics')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left group">
                <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                Analytics
              </button>

              <button onClick={(e) => handleAction(e, 'Share')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left group">
                <Share2 className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                Share
              </button>

              <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1 mx-2" />

              {/* Destructive Actions */}
              <button onClick={(e) => handleAction(e, 'Edit')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left group">
                <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                Edit
              </button>

              <button onClick={(e) => handleAction(e, 'Delete')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-left group">
                <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                Delete
              </button>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>

      <DeletePollModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        pollTitle={poll?.title}
      />

      <SharePollModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pollId={poll?._id}
      />
    </>
  );
};

export default PollActions;
