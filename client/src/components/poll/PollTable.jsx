import React from 'react';
import { format, isPast } from 'date-fns';
import { Copy, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PollActions from './PollActions';
import toast from 'react-hot-toast';

/**
 * Modern Minimal Poll Table
 */
const PollTable = ({ polls = [], refreshData }) => {
  if (!polls || polls.length === 0) return null;

  const handleCopyCode = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#121212]">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-400 dark:text-gray-500 uppercase bg-gray-50/50 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-zinc-800">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Title</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Questions</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Code</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider hidden md:table-cell">Author</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider hidden lg:table-cell">Role</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => {
            const {
              _id,
              title = 'Untitled',
              expiryDate,
              questions = [],
              participationCode = '',
              creatorId
            } = poll;

            // Determine Status
            const isExpired = expiryDate ? isPast(new Date(expiryDate)) : false;
            const currentStatus = isExpired ? 'EXPIRED' : (poll.status || 'DRAFT');

            let statusColor = '';
            let statusLabel = '';
            switch (currentStatus) {
              case 'EXPIRED':
                statusColor = 'bg-blue-500/10 text-blue-500 dark:text-blue-400';
                statusLabel = 'Completed';
                break;
              case 'PUBLISHED':
                statusColor = 'bg-emerald-500/10 text-emerald-500';
                statusLabel = 'Published';
                break;
              case 'SCHEDULED':
                statusColor = 'bg-indigo-500/10 text-indigo-400';
                statusLabel = 'Scheduled';
                break;
              default:
                statusColor = 'bg-zinc-800 text-gray-400';
                statusLabel = 'Draft';
                break;
            }

            // For Author, we can use the creatorId object if populated, else fallback
            const authorName = creatorId?.name || 'YOU';
            const authorRole = creatorId?.role || 'CREATOR';

            return (
              <tr 
                key={_id} 
                className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a] transition-colors group cursor-pointer"
                onClick={(e) => {
                  // If they click on the row, take them to analytics (but ignore if they clicked a button)
                  if (!e.target.closest('button') && !e.target.closest('a')) {
                    window.location.href = `/analytics/${_id}`;
                  }
                }}
              >
                {/* Title */}
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                  <div className="line-clamp-1 max-w-[200px] sm:max-w-[300px]">{title}</div>
                </td>
                
                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                </td>
                
                {/* Questions */}
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-300">
                  {questions.length}
                </td>
                
                {/* Code */}
                <td className="px-6 py-4">
                  {participationCode ? (
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-300 font-medium">
                      {participationCode}
                      <button 
                        onClick={(e) => handleCopyCode(e, participationCode)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        title="Copy Code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">-</span>
                  )}
                </td>
                
                {/* Author */}
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-300 uppercase hidden md:table-cell">
                  {authorName}
                </td>
                
                {/* Role */}
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-gray-400 rounded-full border border-zinc-700">
                    {authorRole}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4 text-right relative">
                  <div className="inline-block" onClick={e => e.stopPropagation()}>
                    <PollActions poll={poll} onRefresh={refreshData} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PollTable;
