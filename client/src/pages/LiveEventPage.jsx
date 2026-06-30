import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLivePollDashboard } from '../api/live.api.js';
import { pausePoll, resumePoll } from '../api/poll.api.js';
import useSocket from '../hooks/useSocket.js';
import { useAuth } from '../hooks/useAuth.js';
import LiveTopBar from '../components/live/LiveTopBar.jsx';
import LiveCenter from '../components/live/LiveCenter.jsx';
import LiveSidebar from '../components/live/LiveSidebar.jsx';
import LiveControls from '../components/live/LiveControls.jsx';
import FloatingQRPanel from '../components/live/FloatingQRPanel.jsx';
import ReactionOverlay from '../components/live/ReactionOverlay.jsx';
import toast from 'react-hot-toast';

const LiveEventPage = () => {
  const { pollId } = useParams();
  const socket = useSocket();
  const { user } = useAuth();
  
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);

  // Control States
  const [hideCharts, setHideCharts] = useState(false);
  const [showQrOnly, setShowQrOnly] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Presentation Mode States
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const isOrganizer = user?._id === liveData?.creatorId;

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getLivePollDashboard(pollId);
      setLiveData(data);
    } catch (err) {
      setError(err.message || 'Failed to load live event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [pollId]);

  useEffect(() => {
    if (!socket || !pollId) return;

    socket.emit('join-live-room', pollId);

    socket.on('live-analytics-update', (newDashboardData) => {
      setLiveData(newDashboardData);
    });

    socket.on('live-response-update', (newStats) => {
      setLiveData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...newStats
        };
      });
    });

    socket.on('live-question-update', (newQuestions) => {
      setLiveData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: newQuestions
        };
      });
    });

    socket.on('active-users-update', (count) => {
      setActiveUsers(count);
    });

    socket.on('active-question-changed', (data) => {
      const newActiveQuestionId = data?.questionId !== undefined ? data.questionId : data;
      const newActiveQuestionStartTime = data?.startTime || null;

      setLiveData((prev) => {
        if (!prev) return prev;
        
        const qIndex = prev.questions?.findIndex(q => q.questionId === newActiveQuestionId);
        if (qIndex >= 0) {
          setCurrentQuestionIndex(qIndex);
        }

        return {
          ...prev,
          activeQuestionId: newActiveQuestionId,
          activeQuestionStartTime: newActiveQuestionStartTime
        };
      });
    });

    return () => {
      socket.emit('leave-live-room', pollId);
      socket.off('live-analytics-update');
      socket.off('live-response-update');
      socket.off('live-question-update');
      socket.off('active-users-update');
      socket.off('active-question-changed');
    };
  }, [socket, pollId]);

  // Sync isPresenting with browser fullscreen API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPresenting(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard Shortcuts for Presentation Mode
  useEffect(() => {
    if (!isOrganizer) return;

    const handleKeyDown = async (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.key.toLowerCase()) {
        case 'f':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(err));
          } else {
            document.exitFullscreen().catch(err => console.error(err));
          }
          break;
        case 'q':
          setShowQrOnly(prev => !prev);
          break;
        case 'c':
          setHideCharts(prev => !prev);
          break;
        case ' ': // Space
          e.preventDefault(); // Prevent scrolling down
          if (liveData?.status === 'PUBLISHED') {
            try {
              await pausePoll(pollId);
              toast('Poll Paused', { icon: '⏸️' });
            } catch (err) {
              console.error(err);
            }
          } else if (liveData?.status === 'PAUSED') {
            try {
              await resumePoll(pollId);
              toast('Poll Resumed', { icon: '▶️' });
            } catch (err) {
              console.error(err);
            }
          }
          break;
        case 'n':
        case 'arrowright':
          setCurrentQuestionIndex(prev => Math.min(prev + 1, (liveData?.questions?.length || 1) - 1));
          break;
        case 'p':
        case 'arrowleft':
          setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOrganizer, liveData, pollId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
        <div className="w-full max-w-5xl space-y-8 animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-zinc-800 rounded-3xl w-full"></div>
          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              <div className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-3xl w-full"></div>
              <div className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-3xl w-full"></div>
            </div>
            <div className="w-96 hidden lg:block h-screen bg-gray-200 dark:bg-zinc-800 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 text-center">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-100 dark:border-red-900/30">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Live Event Unavailable</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">{error}</p>
        <button 
          onClick={fetchDashboard}
          className="mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!liveData) return null;

  return (
    <div key={resetKey} className={`h-screen w-screen overflow-hidden flex flex-col font-sans selection:bg-orange-500/30 ${isPresenting ? 'bg-black' : 'bg-gradient-to-br from-orange-50/50 via-white to-orange-100/30 dark:from-zinc-950 dark:via-zinc-900/80 dark:to-orange-900/10'}`}>
      
      {!isPresenting && (
        <LiveTopBar stats={liveData} isOrganizer={isOrganizer} pollId={pollId} activeUsers={activeUsers} />
      )}
      
      <FloatingQRPanel 
        pollId={pollId}
        participationCode={liveData.participationCode}
        isOpen={showQrOnly}
        onClose={() => setShowQrOnly(false)}
      />

      {/* Floating Reactions Overlay */}
      <ReactionOverlay socket={socket} />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <LiveCenter 
          questions={liveData.questions} 
          hideCharts={hideCharts} 
          autoRotate={autoRotate} 
          timeline={liveData.timeline}
          isPresenting={isPresenting}
          currentQuestionIndex={currentQuestionIndex}
          activeQuestionId={liveData.activeQuestionId}
          activeQuestionStartTime={liveData.activeQuestionStartTime}
          activeUsers={activeUsers}
        />
        
        {!isPresenting && (
          <LiveSidebar 
            pollId={pollId} 
            totalResponses={liveData.totalResponses} 
            participationCode={liveData.participationCode}
          />
        )}
      </main>

      {isOrganizer && !isPresenting && (
        <LiveControls 
          pollId={pollId} 
          liveData={liveData}
          controls={{
            hideCharts, setHideCharts,
            showQrOnly, setShowQrOnly,
            autoRotate, setAutoRotate,
            resetLiveScreen: () => setResetKey(prev => prev + 1),
            refreshData: fetchDashboard
          }}
        />
      )}
    </div>
  );
};

export default LiveEventPage;
