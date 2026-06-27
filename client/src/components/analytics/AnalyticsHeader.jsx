import React from 'react';
import { Calendar, Users, Clock, Settings, ArrowLeft, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { exportAnalyticsCSV, exportAnalyticsPDF } from '../../api/analytics.api';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';

/**
 * Analytics Header (Poll Details)
 * 
 * Displays the core metadata (details) for the poll at the top of the analytics dashboard.
 * Because the parent (AnalyticsPage) listens to Socket.io and updates the state,
 * these details (Response count, Status, Last response time) update in real-time automatically!
 * 
 * @param {Object} poll - The poll data object
 */
const AnalyticsHeader = ({ poll }) => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(null); // 'csv' | 'pdf' | null

  const handleExport = async (type) => {
    setIsExporting(type);
    try {
      const blob = type === 'csv' 
        ? await exportAnalyticsCSV(poll._id) 
        : await exportAnalyticsPDF(poll._id);
        
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${poll.title.replace(/\s+/g, '_')}_analytics.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${type.toUpperCase()} exported successfully!`);
    } catch (error) {
      toast.error(error.message || `Failed to export ${type.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  // Graceful fallback while loading
  if (!poll) return null;

  const {
    title = 'Untitled Poll',
    description,
    createdAt,
    expiryDate,
    totalResponses = 0,
    lastResponseAt // Assuming the backend sends the timestamp of the last response
  } = poll;

  // Determine Status
  const isExpired = expiryDate ? isPast(new Date(expiryDate)) : false;
  
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden transition-all duration-500">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col space-y-4 max-w-2xl">
        
        {/* Back Button & Status Badge */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/polls')}
            className="p-2 bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl border border-gray-100 dark:border-zinc-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border ${
            isExpired 
              ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500 border-red-100 dark:border-red-900/30' 
              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
          }`}>
            <Activity className="w-3.5 h-3.5" />
            {isExpired ? 'Expired' : 'Live / Active'}
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            {title}
          </h1>
          {description && (
            <div 
              className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm sm:text-base prose dark:prose-invert prose-orange max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
            />
          )}
        </div>

      </div>

      {/* Real-time Metadata Metrics */}
      <div className="relative z-10 flex flex-col sm:flex-row md:flex-col gap-4 min-w-[200px]">
        
        {/* Response Count (Updates Live) */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <div className="p-2 bg-white dark:bg-blue-500/20 rounded-lg shadow-sm">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responses</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">
              {totalResponses.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Last Response Time (Updates Live) */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
          <div className="p-2 bg-white dark:bg-purple-500/20 rounded-lg shadow-sm">
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Response</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {lastResponseAt ? `${formatDistanceToNow(new Date(lastResponseAt))} ago` : 'No responses yet'}
            </span>
          </div>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
          <div className="p-2 bg-white dark:bg-zinc-700/50 rounded-lg shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : 'Unknown'}
            </span>
          </div>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2 w-full mt-2 sm:mt-0">
          <button
            onClick={() => handleExport('csv')}
            disabled={!!isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-400 rounded-xl font-semibold text-sm transition-colors border border-green-200 dark:border-green-900/30 disabled:opacity-50"
            title="Download CSV"
          >
            {isExporting === 'csv' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-xl font-semibold text-sm transition-colors border border-red-200 dark:border-red-900/30 disabled:opacity-50"
            title="Download PDF"
          >
            {isExporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            PDF
          </button>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsHeader;
