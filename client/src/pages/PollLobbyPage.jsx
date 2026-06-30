import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Play, Loader2, Link as LinkIcon, ArrowLeft, Trophy, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import useSocket from '../hooks/useSocket';
import { getPollAnalytics } from '../api/analytics.api';
import ReactionOverlay from '../components/live/ReactionOverlay';
import LeaderboardView from '../components/live/LeaderboardView';

/**
 * Poll Lobby Page (Presentation Screen)
 * 
 * Designed to be projected on a big screen. Displays a QR code initially.
 * If the admin publishes a question, this page smoothly transitions to 
 * displaying the live question and its real-time results.
 */
const PollLobbyPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);

  const publicLink = `${window.location.origin}/poll/${pollId}`;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // We use the analytics endpoint so we get both poll metadata AND the questions with live votes
        const response = await getPollAnalytics(pollId);
        setAnalytics(response);
      } catch (error) {
        toast.error('Failed to load presentation data');
        navigate('/polls');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [pollId, navigate]);

  // Socket setup for live user counting and real-time question updates
  useEffect(() => {
    if (!socket || !pollId) return;

    socket.emit('join-poll', pollId);

    const handleActiveUsersUpdate = (count) => {
      setActiveUsers(count);
    };

    const handleAnalyticsUpdated = (updatedData) => {
      if (updatedData) setAnalytics(updatedData);
    };

    const handleActiveQuestionChanged = (newActiveQuestionId) => {
      setAnalytics(prev => {
        if (!prev || !prev.poll) return prev;
        return {
          ...prev,
          poll: { ...prev.poll, activeQuestionId: newActiveQuestionId }
        };
      });
    };
    
    // Also fetch fresh data silently when a response is submitted just in case
    const handleResponseSubmitted = async () => {
      try {
        const response = await getPollAnalytics(pollId);
        setAnalytics(response);
      } catch (error) {}
    };

    socket.on('active-users-update', handleActiveUsersUpdate);
    socket.on('analyticsUpdated', handleAnalyticsUpdated);
    socket.on('active-question-changed', handleActiveQuestionChanged);
    socket.on('responseSubmitted', handleResponseSubmitted);

    return () => {
      socket.emit('leave-poll', pollId);
      socket.off('active-users-update', handleActiveUsersUpdate);
      socket.off('analyticsUpdated', handleAnalyticsUpdated);
      socket.off('active-question-changed', handleActiveQuestionChanged);
      socket.off('responseSubmitted', handleResponseSubmitted);
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

  if (!analytics || !analytics.poll) return null;

  const { poll, questionsData } = analytics;
  const activeQuestionId = poll.activeQuestionId;
  const activeQuestion = activeQuestionId 
    ? questionsData?.find(q => (q.questionId || q._id) === activeQuestionId) 
    : null;

  const isExpired = poll.status === 'EXPIRED';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans selection:bg-orange-500/30 transition-colors overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="w-full p-6 flex items-center justify-between z-10 shrink-0">
        <button 
          onClick={() => navigate('/polls')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Polls
        </button>

        <div className="flex items-center gap-4">
          {/* Responses Counter Widget (Only if active question) */}
          {activeQuestion && (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full shadow-sm dark:shadow-lg transition-colors">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold uppercase tracking-wider">
                Responses
              </span>
              <div className="flex items-center gap-1.5 px-3 py-0.5 bg-orange-100 dark:bg-orange-500/20 rounded-md transition-colors">
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {activeQuestion.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0} / {activeUsers}
                </span>
              </div>
            </div>
          )}

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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {isExpired ? (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-6xl"
            >
              <LeaderboardView pollId={pollId} />
            </motion.div>
          ) : !activeQuestion ? (
            <motion.div 
              key="lobby"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center w-full max-w-6xl"
            >
              <div className="text-center mb-10 max-w-3xl">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors">
                  {poll.title}
                </h1>
                <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 font-medium transition-colors">
                  Join the session and get ready to answer!
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 w-full">
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
                        <li>Enter the participation code: <strong className="text-orange-500 text-xl tracking-widest">{poll.participationCode}</strong></li>
                      )}
                    </ol>
                  </div>

                  {poll.participationCode && (
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-none transition-colors inline-block">
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
                      Open Analytics
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-question"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-5xl flex flex-col items-center"
            >
              <ActiveQuestionPresenter question={activeQuestion} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Reactions Overlay */}
      <ReactionOverlay socket={socket} />
    </div>
  );
};

/**
 * Presenter View for the Active Question
 * Renders the question text and real-time updating vote bars.
 */
const ActiveQuestionPresenter = ({ question }) => {
  const maxVotes = question.options?.reduce((max, opt) => Math.max(max, opt.votes || 0), 0) || 0;

  const textLength = question.text?.replace(/<[^>]*>?/gm, '').length || 0;
  let textSizeClass = 'text-4xl sm:text-5xl';
  if (textLength > 100) {
    textSizeClass = 'text-3xl sm:text-4xl';
  }
  if (textLength > 200) {
    textSizeClass = 'text-2xl sm:text-3xl';
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-zinc-800/50 p-8 sm:p-12 transition-colors">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
          <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
          Live Question
        </span>
        <h2 
          className={`font-extrabold text-gray-900 dark:text-white leading-tight break-words break-all w-full ${textSizeClass}`}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.text) }}
        />
      </div>

      <div className="space-y-6">
        {['SINGLE_CHOICE', 'MULTI_SELECT'].includes(question.questionType) && question.options && (
          question.options.map((option, idx) => {
            const votes = option.votes || 0;
            const percentage = option.percentage || 0;
            const isWinner = votes === maxVotes && maxVotes > 0;

            return (
              <div 
                key={option.optionId || idx}
                className="relative flex items-center p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 overflow-hidden group"
              >
                {/* Background Progress Bar */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`absolute left-0 top-0 bottom-0 opacity-10 dark:opacity-20 ${isWinner ? 'bg-orange-500' : 'bg-gray-400'}`}
                />
                
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${isWinner ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/30 dark:text-orange-400' : 'bg-white text-gray-500 dark:bg-zinc-700 dark:text-gray-400'} shadow-sm`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                      {option.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      {votes} {votes === 1 ? 'vote' : 'votes'}
                    </span>
                    <span className={`text-3xl font-black w-24 text-right ${isWinner ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {question.questionType === 'RATING' && (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-700/50">
            <span className="text-2xl text-gray-500 dark:text-gray-400 mb-4">Average Rating</span>
            <div className="text-8xl font-black text-orange-500 flex items-baseline gap-2">
              {question.averageRating?.toFixed(1) || '0.0'}
              <span className="text-4xl text-gray-300 dark:text-zinc-600">/ 5</span>
            </div>
            <span className="mt-6 text-xl text-gray-600 dark:text-gray-300">
              Total Ratings: <strong className="text-gray-900 dark:text-white">{question.totalVotes || 0}</strong>
            </span>
          </div>
        )}

        {['OPEN_TEXT', 'WORD_CLOUD'].includes(question.questionType) && (
          <div className="p-8 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-700/50">
            <span className="text-xl text-gray-500 dark:text-gray-400 mb-6 block font-medium">Recent Responses ({question.totalVotes || 0} total):</span>
            <div className="flex flex-wrap gap-4">
              {question.texts && question.texts.length > 0 ? (
                question.texts.slice(-10).map((txt, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    className="text-xl text-gray-800 dark:text-gray-100 bg-white dark:bg-zinc-700 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-600"
                  >
                    "{txt}"
                  </motion.div>
                ))
              ) : (
                <p className="text-xl text-gray-400 italic">Waiting for responses...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollLobbyPage;
