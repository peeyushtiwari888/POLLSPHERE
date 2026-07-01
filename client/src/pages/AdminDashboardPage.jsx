import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAdminStats, getRecentActivities, getAllUsers } from '../api/admin.api';
import { Users, Activity, ListOrdered, BarChart3, Clock, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('activities'); // 'activities', 'users', 'polls', 'events'
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        const [statsData, activitiesData, usersData, pollsData, eventsData] = await Promise.all([
          getAdminStats(),
          getRecentActivities(),
          getAllUsers(),
          import('../api/admin.api').then(m => m.getAllAdminPolls()),
          import('../api/admin.api').then(m => m.getAllAdminEvents()),
        ]);
        
        setStats(statsData);
        setActivities(activitiesData);
        setUsers(usersData);
        setPolls(pollsData);
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin dashboard data. You may not have permission.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      const { toggleUserBlock } = await import('../api/admin.api');
      const response = await toggleUserBlock(userId);
      // Update local state to reflect the blocked status
      setUsers(users.map(u => (u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u)));
      import('react-hot-toast').then(toast => toast.toast.success(response.message));
    } catch (err) {
      import('react-hot-toast').then(toast => toast.toast.error(err.message || 'Failed to toggle block status'));
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      const { toggleUserRole } = await import('../api/admin.api');
      const response = await toggleUserRole(userId);
      setUsers(users.map(u => (u._id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u)));
      import('react-hot-toast').then(toast => toast.toast.success(response.message));
    } catch (err) {
      import('react-hot-toast').then(toast => toast.toast.error(err.response?.data?.message || err.message || 'Failed to change role'));
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) return;
    try {
      const { deleteAdminPoll } = await import('../api/admin.api');
      await deleteAdminPoll(pollId);
      setPolls(polls.filter(p => p._id !== pollId));
      import('react-hot-toast').then(toast => toast.toast.success('Poll deleted successfully'));
    } catch (err) {
      import('react-hot-toast').then(toast => toast.toast.error(err.response?.data?.message || 'Failed to delete poll'));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      const { deleteAdminEvent } = await import('../api/admin.api');
      await deleteAdminEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
      import('react-hot-toast').then(toast => toast.toast.success('Event deleted successfully'));
    } catch (err) {
      import('react-hot-toast').then(toast => toast.toast.error(err.response?.data?.message || 'Failed to delete event'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-zinc-400">{error}</p>
        <Link to="/dashboard" className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const renderStatCard = (title, value, icon, colorClass) => (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-4 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
            Welcome back, {user?.name || user?.username}. Here's what's happening on PollSphere.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderStatCard('Total Users', stats?.totalUsers || 0, <Users className="w-6 h-6 text-blue-600" />, 'bg-blue-100 dark:bg-blue-900/30')}
          {renderStatCard('Total Polls', stats?.totalPolls || 0, <BarChart3 className="w-6 h-6 text-green-600" />, 'bg-green-100 dark:bg-green-900/30')}
          {renderStatCard('Recorded Activities', stats?.totalActivities || 0, <Activity className="w-6 h-6 text-purple-600" />, 'bg-purple-100 dark:bg-purple-900/30')}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('activities')}
              className={`${
                activeTab === 'activities'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-zinc-400 dark:hover:text-zinc-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <ListOrdered className="w-4 h-4" /> Recent Activities
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-zinc-400 dark:hover:text-zinc-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Users className="w-4 h-4" /> All Users
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`${
                activeTab === 'polls'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-zinc-400 dark:hover:text-zinc-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <BarChart3 className="w-4 h-4" /> All Polls
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`${
                activeTab === 'events'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-zinc-400 dark:hover:text-zinc-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <AlertCircle className="w-4 h-4" /> All Events
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
          {activeTab === 'activities' ? (
            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity._id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-colors flex items-start gap-4">
                    <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-full mt-1">
                      <Activity className="w-4 h-4 text-gray-500 dark:text-zinc-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user ? activity.user.username : 'Guest User'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(activity.createdAt).toLocaleString()}
                        <span className="ml-3 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 font-mono text-[10px]">
                          {activity.actionType}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">No activities recorded yet.</div>
              )}
            </div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {users.map((u) => (
                    <tr key={u._id} className={`hover:bg-gray-50 dark:hover:bg-zinc-800/80 ${u.isBlocked ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {u.avatarUrl ? (
                            <img className="h-8 w-8 rounded-full object-cover" src={u.avatarUrl} alt="" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-700 dark:text-orange-300 font-bold text-xs uppercase">
                              {u.username.substring(0, 2)}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{u.username}</div>
                            <div className="text-sm text-gray-500 dark:text-zinc-400">{u.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isBlocked ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        {user?._id !== u._id && (
                          <>
                            <button
                              onClick={() => handleToggleRole(u._id)}
                              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                            >
                              {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleToggleBlock(u._id)}
                                className={`${u.isBlocked ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300' : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'}`}
                              >
                                {u.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'polls' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Question</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Creator</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Responses</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {polls.map((poll) => (
                    <tr key={poll._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/80">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{poll.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        {poll.creatorId?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        {poll.responses?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        {new Date(poll.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button onClick={() => setSelectedPoll(poll)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300">View</button>
                        <button onClick={() => handleDeletePoll(poll._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Event Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Creator</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/80">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        {event.createdBy?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'live' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <Link to={`/event/${event.slug || event._id}`} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300">View</Link>
                        <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Poll Details Modal */}
      <AnimatePresence>
        {selectedPoll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Poll Details</h2>
                <button onClick={() => setSelectedPoll(null)} className="text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-left">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Title</h3>
                  <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{selectedPoll.title}</p>
                </div>
                {selectedPoll.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Description</h3>
                    <div 
                      className="mt-1 text-sm text-gray-900 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none [&>p]:m-0"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPoll.description) }} 
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Creator</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedPoll.creatorId?.name || selectedPoll.creatorId?.username || 'Unknown'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Status</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedPoll.status}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Participation Code (Password)</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded inline-block">
                      {selectedPoll.participationCode || 'None'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400">Expiry Date</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedPoll.expiryDate ? new Date(selectedPoll.expiryDate).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2">Questions ({selectedPoll.questions?.length || 0})</h3>
                  <div className="space-y-3">
                    {selectedPoll.questions?.map((q, idx) => (
                      <div key={q._id} className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                        <div className="font-medium text-sm text-gray-900 dark:text-white flex gap-1 items-start">
                          <span>Q{idx + 1}: </span>
                          <span 
                            className="[&>p]:inline" 
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(q.text) }} 
                          />
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                          Type: {q.questionType} | Points: {q.points} | Duration: {q.duration}s
                        </p>
                        {q.options && q.options.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {q.options.map(opt => (
                              <li key={opt._id} className={`text-sm ${opt.isCorrect ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-zinc-400'}`}>
                                • {opt.text} {opt.isCorrect && '(Correct)'}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedPoll(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  Close
                </button>
                <Link 
                  to={`/poll/${selectedPoll._id}`}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  Join Poll
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardPage;
