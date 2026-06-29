import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, Loader2, AlertCircle, ArrowLeft, Check, Square
} from 'lucide-react';
import { getEventParticipants, toggleParticipantAttendance } from '../api/event.api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EventParticipantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [eventDetails, setEventDetails] = useState({ title: '', participantsCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasMore: false });

  const observerTarget = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchParticipants = useCallback(async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) setIsFetchingMore(true);
      else setIsLoading(true);
      setError(null);

      const params = {
        page,
        limit: 20,
        search: debouncedSearch,
      };

      if (!params.search) delete params.search;

      const response = await getEventParticipants(id, params);
      const newParticipants = response?.data || [];
      const pagInfo = response?.pagination || { totalPages: 1, page: 1 };

      if (response?.eventDetails) {
        setEventDetails(response.eventDetails);
      }

      setParticipants(prev => isLoadMore ? [...prev, ...newParticipants] : newParticipants);
      setPagination({
        page: pagInfo.page,
        totalPages: pagInfo.pages,
        hasMore: pagInfo.page < pagInfo.pages
      });
    } catch (err) {
      setError(err.message || 'Failed to load participants. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [id, debouncedSearch]);

  useEffect(() => {
    fetchParticipants(1, false);
  }, [fetchParticipants]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasMore && !isLoading && !isFetchingMore) {
          fetchParticipants(pagination.page + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget.current, pagination.hasMore, isLoading, isFetchingMore, fetchParticipants, pagination.page]);

  const handleToggleAttendance = async (registrationId, currentStatus) => {
    try {
      // Optimistic update
      setParticipants(prev => prev.map(p => 
        p._id === registrationId ? { ...p, hasAttended: !currentStatus } : p
      ));
      
      await toggleParticipantAttendance(id, registrationId, !currentStatus);
      toast.success(currentStatus ? 'Attendance removed' : 'Attendance marked');
    } catch (err) {
      // Revert on failure
      setParticipants(prev => prev.map(p => 
        p._id === registrationId ? { ...p, hasAttended: currentStatus } : p
      ));
      toast.error(err.message || 'Failed to update attendance');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on name string
  const getAvatarColor = (name) => {
    const colors = [
      'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 
      'bg-orange-500', 'bg-green-500', 'bg-teal-500', 'bg-blue-500'
    ];
    if (!name) return colors[0];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="w-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white w-fit transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
          {eventDetails.title || 'Loading Event...'}
          {eventDetails.participantsCount !== undefined && (
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              [{eventDetails.participantsCount} Participants]
            </span>
          )}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage participants for this event
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-[400px] group mt-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text"
          placeholder="Search participants"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-11 pr-4 bg-gray-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-gray-300 dark:focus:border-zinc-700 transition-all shadow-sm"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Participants Table */}
      <div className="w-full bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-100 dark:border-zinc-800/80">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered At</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {isLoading && participants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No participants found.
                  </td>
                </tr>
              ) : (
                participants.map((participant) => {
                  const hasUserObj = !!participant.user;
                  const displayName = participant.participantName;
                  const displayEmail = hasUserObj ? participant.user.email : '-';
                  const displayUsername = hasUserObj && participant.user.email ? `@${participant.user.email.split('@')[0]}` : '';
                  const profilePic = hasUserObj ? participant.user.profilePicture : null;

                  return (
                    <tr key={participant._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {profilePic ? (
                            <img src={profilePic} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(displayName)}`}>
                              {getInitials(displayName)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{displayName}</span>
                            {displayUsername && (
                              <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">{displayUsername}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {displayEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {participant.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {format(new Date(participant.registeredAt), 'd MMM yyyy, h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleAttendance(participant._id, participant.hasAttended)}
                          className="p-1 rounded transition-transform active:scale-95"
                          title="Toggle Attendance"
                        >
                          {participant.hasAttended ? (
                            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white stroke-[3]" />
                            </div>
                          ) : (
                            <Square className="w-6 h-6 text-gray-300 dark:text-zinc-600" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infinite Scroll Footer */}
      <div ref={observerTarget} className="py-6 flex flex-col items-center justify-center text-center">
        {isFetchingMore && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

    </div>
  );
};

export default EventParticipantsPage;
