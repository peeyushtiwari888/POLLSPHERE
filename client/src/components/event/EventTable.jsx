import React, { useState } from 'react';
import { 
  MoreVertical, Edit, Trash2, BarChart3, Users,
  Calendar, MapPin, Video, Eye, Loader2, UserPlus, Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { deleteEvent } from '../../api/event.api';
import toast from 'react-hot-toast';
import ManualRegistrationModal from './ManualRegistrationModal';

const EventTable = ({ events = [], isLoading, refreshData }) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [registerModalEvent, setRegisterModalEvent] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ONLINE': return <Video className="w-4 h-4 text-blue-500" />;
      case 'OFFLINE': return <MapPin className="w-4 h-4 text-orange-500" />;
      case 'HYBRID': return <Users className="w-4 h-4 text-purple-500" />;
      default: return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    
    try {
      setDeletingId(id);
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      refreshData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
      setActiveMenuId(null);
    }
  };

  const handleShare = (slug) => {
    const url = `${window.location.origin}/event/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Registration link copied to clipboard!');
    setActiveMenuId(null);
  };

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  if (isLoading && events.length === 0) {
    return (
      <div className="w-full flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or create a new event.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm animate-in fade-in duration-500">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-950/50 border-b border-gray-100 dark:border-zinc-800">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/event/${event.slug}`)}
                    title="View Event Details"
                  >
                    {event.thumbnail ? (
                      <img src={event.thumbnail} alt={event.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-zinc-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-500" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline max-w-[200px] truncate">{event.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{event.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-full">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {getTypeIcon(event.type)}
                    <span className="capitalize">{event.type.toLowerCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
                    <span>{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                    <span className="text-xs text-gray-400">{format(new Date(event.startDate), 'h:mm a')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <div className="flex items-center justify-end gap-2">
                    {/* Desktop Actions */}
                    <div className="hidden xl:flex items-center gap-2">
                      <button onClick={() => handleShare(event.slug)} className="p-1.5 text-gray-400 hover:text-green-500 transition-colors" title="Share Link">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate(`/event/${event.slug}`)} className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors" title="View Public Page">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setRegisterModalEvent(event)} className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors" title="Register Participant">
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate(`/events/${event._id}/participants`)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors" title="View Participants">
                        <Users className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate(`/events/analytics/dashboard`)} className="p-1.5 text-gray-400 hover:text-purple-500 transition-colors" title="Analytics">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate(`/events/${event._id}/edit`)} className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(event._id)} disabled={deletingId === event._id} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        {deletingId === event._id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <div className="xl:hidden relative">
                      <button onClick={() => toggleMenu(event._id)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeMenuId === event._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 z-50 overflow-hidden">
                          <button onClick={() => handleShare(event.slug)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2">
                            <Share2 className="w-4 h-4" /> Share Link
                          </button>
                          <button onClick={() => navigate(`/event/${event.slug}`)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> View Public Page
                          </button>
                          <button onClick={() => { setRegisterModalEvent(event); setActiveMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Register User
                          </button>
                          <button onClick={() => navigate(`/events/${event._id}/participants`)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Participants
                          </button>
                          <button onClick={() => navigate(`/events/analytics/dashboard`)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Analytics
                          </button>
                          <button onClick={() => navigate(`/events/${event._id}/edit`)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2">
                            <Edit className="w-4 h-4" /> Edit Event
                          </button>
                          <button onClick={() => handleDelete(event._id)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-zinc-700">
                            {deletingId === event._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Event
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ManualRegistrationModal 
        isOpen={!!registerModalEvent} 
        onClose={() => setRegisterModalEvent(null)}
        event={registerModalEvent}
        onSuccess={() => refreshData()}
      />
    </div>
  );
};

export default EventTable;
