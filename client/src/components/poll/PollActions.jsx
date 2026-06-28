import React, { useState } from 'react';
import { Eye, Edit3, BarChart3, Share2, Trash2, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deletePoll, publishPoll } from '../../api/poll.api';
import DeletePollModal from './DeletePollModal';
import SharePollModal from './SharePollModal';
import PublishPollModal from './PublishPollModal';

/**
 * Poll Actions Inline Menu
 * 
 * Renders a horizontal row of action icons (Share, Analytics, Edit, Delete).
 */
const PollActions = ({ poll, onRefresh }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();

  const handleAction = (e, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (actionName === 'Delete') {
      setIsDeleteModalOpen(true);
    } else if (actionName === 'Edit') {
      navigate(`/polls/${poll._id}/edit`);
    } else if (actionName === 'Share') {
      setIsShareModalOpen(true);
    } else if (actionName === 'Publish') {
      setIsPublishModalOpen(true);
    } else if (actionName === 'Analytics') {
      navigate(`/analytics/${poll._id}`);
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

  const handleConfirmPublish = async (publishData) => {
    setIsPublishing(true);
    try {
      await publishPoll(poll._id, publishData);
      toast.success(publishData.scheduledPublishDate ? 'Poll scheduled successfully' : 'Poll published successfully');
      setIsPublishModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error.message || 'Failed to publish poll');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1 sm:gap-2">
        {/* Publish/Share Action */}
        {poll?.status === 'DRAFT' ? (
          <button 
            onClick={(e) => handleAction(e, 'Publish')} 
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-colors focus:outline-none"
            title="Publish Poll"
          >
            <Globe className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={(e) => handleAction(e, 'Share')} 
            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-colors focus:outline-none"
            title="Share Poll"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
        
        {/* Analytics Action */}
        <button 
          onClick={(e) => handleAction(e, 'Analytics')} 
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors focus:outline-none"
          title="View Analytics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        {/* Edit Action (Only if Draft) */}
        {poll?.status === 'DRAFT' && (
          <button 
            onClick={(e) => handleAction(e, 'Edit')} 
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-colors focus:outline-none"
            title="Edit Poll"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}

        {/* Delete Action */}
        <button 
          onClick={(e) => handleAction(e, 'Delete')} 
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors focus:outline-none"
          title="Delete Poll"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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

      <PublishPollModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        isPublishing={isPublishing}
        pollTitle={poll?.title}
      />
    </>
  );
};

export default PollActions;
