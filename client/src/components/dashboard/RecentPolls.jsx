import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, PenLine, BarChart2, Share2, Trash2, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SharePollModal from '../poll/SharePollModal';
import DeletePollModal from '../poll/DeletePollModal';
import { deletePoll } from '../../api/poll.api';

/**
 * Premium Recent Polls Table
 * 
 * Displays a list of the user's most recent polls with quick actions.
 * Now consumes real backend data via the `polls` prop.
 * 
 * @param {Array} polls - Array of poll objects from the API
 */
const RecentPolls = ({ polls = [], onRefresh }) => {
  const navigate = useNavigate();
  const [sharePollId, setSharePollId] = useState(null);
  const [deletePollData, setDeletePollData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Helper Functions for Data Formatting ---
  
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getExpiryText = (expiryDate) => {
    if (!expiryDate) return '-';
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    if (expiry < now) return 'Completed';
    
    const diffTime = Math.abs(expiry - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };

  const computeStatus = (poll) => {
    // Basic logic mapping Mongoose schema to UI Statuses
    if (new Date(poll.expiryDate) < new Date()) return 'Completed';
    // You can refine 'Draft' vs 'Active' depending on your business rules 
    // (e.g. if it has responses or isResultsPublished)
    if (!poll.isResultsPublished) return 'Draft'; 
    return 'Active';
  };

  const renderStatusBadge = (status) => {
    const statusConfig = {
      Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
      Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-500/20',
      Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    };

    const classes = statusConfig[status] || statusConfig.Draft;

    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${classes}`}>
        {status}
      </span>
    );
  };

  // --- Action Handlers ---
  const handleView = (id) => navigate(`/poll/${id}`);
  const handleEdit = (id) => navigate(`/polls/${id}/edit`);
  // Assuming analytics route for future, else navigate to view
  const handleAnalytics = (id) => navigate(`/analytics/${id}`); 

  const handleDeleteConfirm = async () => {
    if (!deletePollData) return;
    setIsDeleting(true);
    try {
      const pollId = deletePollData._id || deletePollData.id;
      await deletePoll(pollId);
      toast.success('Poll deleted successfully');
      setDeletePollData(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to delete poll');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Polls
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your latest created polls
            </p>
          </div>
          <button 
            onClick={() => navigate('/my-polls')}
            className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors"
          >
            View All &rarr;
          </button>
        </div>

        {/* Table Container (Responsive Scroll) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/20 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poll Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responses</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Expiry</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {polls.length === 0 ? (
                // Empty Array Fallback (Just in case the parent didn't intercept it)
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent polls found.
                  </td>
                </tr>
              ) : (
                polls.map((poll) => {
                  const status = computeStatus(poll);
                  // Assume the backend provides a responseCount, default to 0
                  const responseCount = poll.responseCount || 0; 
                  const pollId = poll._id || poll.id;

                  return (
                    <tr key={pollId} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      
                      {/* Poll Title */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                          {poll.title}
                        </div>
                        {/* Mobile-only secondary info fallback */}
                        <div className="text-xs text-gray-500 lg:hidden mt-1">
                          Created: {formatDate(poll.createdAt)}
                        </div>
                      </td>
                      
                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(status)}
                      </td>
                      
                      {/* Responses */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {responseCount.toLocaleString()}
                      </td>
                      
                      {/* Expiry */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {getExpiryText(poll.expiryDate)}
                      </td>
                      
                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                        {formatDate(poll.createdAt)}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                          
                          {/* View */}
                          <button onClick={() => handleView(pollId)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="View Poll">
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Edit */}
                          <button onClick={() => handleEdit(pollId)} className="p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors" title="Edit Poll">
                            <PenLine className="w-4 h-4" />
                          </button>
                          
                          {/* Analytics */}
                          <button onClick={() => handleAnalytics(pollId)} className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors" title="View Analytics">
                            <BarChart2 className="w-4 h-4" />
                          </button>
                          
                          {/* Share */}
                          <button onClick={() => setSharePollId(pollId)} className="p-1.5 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors" title="Share Poll">
                            <Share2 className="w-4 h-4" />
                          </button>
                          
                          {/* Delete */}
                          <button onClick={() => setDeletePollData(poll)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Poll">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                        </div>
                        
                        {/* Mobile fallback (shows a More menu icon instead of hiding actions) */}
                        <div className="sm:hidden text-gray-400 flex justify-end">
                          <button className="p-1" onClick={() => navigate('/my-polls')}>
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals rendered outside the table to avoid z-index/overflow issues */}
      <SharePollModal 
        isOpen={!!sharePollId} 
        onClose={() => setSharePollId(null)} 
        pollId={sharePollId} 
      />

      <DeletePollModal
        isOpen={!!deletePollData}
        onClose={() => setDeletePollData(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        pollTitle={deletePollData?.title}
      />
    </>
  );
};

export default RecentPolls;
