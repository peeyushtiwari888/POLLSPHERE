import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Play, Loader2, Link as LinkIcon, Copy, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useSocket from '../hooks/useSocket';
import { getPollById } from '../api/poll.api';

/**
 * Poll Lobby Page (Presentation Screen)
 * 
 * Designed to be projected on a big screen. Displays a QR code,
 * participation code, and live student count before starting the poll.
 */
const PollLobbyPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);

  // Generate the public link for the QR Code
  const publicLink = `${window.location.origin}/poll/${pollId}`;

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await getPollById(pollId);
        setPoll(response?.data);
      } catch (error) {
        toast.error('Failed to load poll details');
        navigate('/polls');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [pollId, navigate]);

  // Socket setup for live user counting
  useEffect(() => {
    if (!socket || !pollId) return;

    // Join the poll room to listen for user count updates
    socket.emit('join-poll', pollId);

    const handleActiveUsersUpdate = (count) => {
      // The count includes the presenter, so we might subtract 1 if we strictly want 'students'
      // But let's show total active connections for simplicity
      setActiveUsers(count);
    };

    socket.on('active-users-update', handleActiveUsersUpdate);

    return () => {
      socket.emit('leave-poll', pollId);
      socket.off('active-users-update', handleActiveUsersUpdate);
    };
  }, [socket, pollId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4 transition-colors">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse tracking-wide">Setting up lobby...</p>
      </div>
    );
  }

  if (!poll) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans selection:bg-orange-500/30 transition-colors">
      
      {/* Top Navigation Bar */}
      <div className="w-full p-6 flex items-center justify-between z-10">
        <button 
          onClick={() => navigate('/polls')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Polls
        </button>

        {/* Live Counter Widget */}
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full shadow-sm dark:shadow-lg transition-colors">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold uppercase tracking-wider">
            Live Students
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded-md transition-colors">
            <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-gray-900 dark:text-white font-bold">{activeUsers}</span>
          </div>
        </div>
      </div>

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-[0.98] duration-700">
        
        <div className="text-center mb-10 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors">
            {poll.title}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 font-medium transition-colors">
            Join the session and get ready to answer!
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* QR Code Container */}
          <div className="p-8 bg-white rounded-[2rem] shadow-[0_0_50px_rgba(249,115,22,0.1)] dark:shadow-[0_0_50px_rgba(249,115,22,0.15)] ring-8 ring-gray-100 dark:ring-white/10 transition-colors">
            <QRCodeSVG 
              value={publicLink} 
              size={300} 
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={false}
            />
          </div>

          {/* Instructions Container */}
          <div className="flex flex-col space-y-8 max-w-md text-center md:text-left">
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">How to join:</h3>
              <ol className="text-lg text-gray-600 dark:text-gray-300 space-y-3 list-decimal list-inside marker:text-orange-500 marker:font-bold transition-colors">
                <li>Point your phone's camera at the QR code.</li>
                <li>Tap the link that appears on your screen.</li>
                {poll.participationCode && (
                  <li>Enter the participation code below.</li>
                )}
              </ol>
            </div>

            {poll.participationCode && (
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-none transition-colors">
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1 block">
                  Participation Code
                </span>
                <span className="text-5xl font-black text-orange-500 tracking-widest">
                  {poll.participationCode}
                </span>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-bold rounded-xl transition-all shadow-sm active:scale-95"
              >
                <LinkIcon className="w-5 h-5" />
                Copy Link
              </button>

              <button 
                onClick={() => navigate(`/analytics/${pollId}`)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] dark:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Presentation
              </button>
            </div>

          </div>
        </div>

      </div>
      
    </div>
  );
};

export default PollLobbyPage;
