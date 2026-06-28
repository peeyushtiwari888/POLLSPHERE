import React, { useState, useEffect } from 'react';
import { 
  Maximize, Minimize, LayoutDashboard, Pause, Play, 
  CheckCircle, RefreshCw, EyeOff, Eye, QrCode, Repeat, RotateCcw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pausePoll, resumePoll, publishPoll } from '../../api/poll.api.js';

const LiveControls = ({ pollId, liveData, controls }) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    hideCharts, setHideCharts,
    showQrOnly, setShowQrOnly,
    autoRotate, setAutoRotate,
    resetLiveScreen,
    refreshData
  } = controls;

  const isPaused = liveData.status === 'PAUSED';

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error attempting to toggle fullscreen', err);
    }
  };

  const handlePauseResume = async () => {
    try {
      setLoading(true);
      if (isPaused) {
        await resumePoll(pollId);
      } else {
        await pausePoll(pollId);
      }
      await refreshData();
    } catch (err) {
      console.error('Failed to pause/resume', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishResults = async () => {
    try {
      setLoading(true);
      await publishPoll(pollId);
      await refreshData();
    } catch (err) {
      console.error('Failed to publish', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await refreshData();
    setLoading(false);
  };

  const TooltipButton = ({ icon: Icon, label, onClick, active, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 
        ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/90 backdrop-blur-xl px-4 py-3 rounded-full shadow-2xl border border-white/10 z-50 transition-opacity hover:opacity-100 opacity-40">
      
      {/* Playback Controls */}
      <TooltipButton 
        icon={isPaused ? Play : Pause} 
        label={isPaused ? "Resume Poll" : "Pause Poll"} 
        onClick={handlePauseResume}
        active={isPaused}
      />
      
      <TooltipButton 
        icon={CheckCircle} 
        label="Publish Results" 
        onClick={handlePublishResults} 
        disabled={liveData.isResultsPublished}
        active={liveData.isResultsPublished}
      />
      
      <TooltipButton 
        icon={RefreshCw} 
        label="Refresh Data" 
        onClick={handleRefresh} 
      />
      
      <div className="w-px h-6 bg-white/20 mx-2" />
      
      {/* Visual Controls */}
      <TooltipButton 
        icon={hideCharts ? Eye : EyeOff} 
        label={hideCharts ? "Show Charts" : "Hide Charts"} 
        onClick={() => setHideCharts(!hideCharts)} 
        active={hideCharts}
      />
      
      <TooltipButton 
        icon={QrCode} 
        label={showQrOnly ? "Hide QR" : "Show QR Only"} 
        onClick={() => setShowQrOnly(!showQrOnly)} 
        active={showQrOnly}
      />
      
      <TooltipButton 
        icon={Repeat} 
        label={autoRotate ? "Stop Rotate" : "Auto Rotate"} 
        onClick={() => setAutoRotate(!autoRotate)} 
        active={autoRotate}
      />
      
      <TooltipButton 
        icon={RotateCcw} 
        label="Reset Live Screen" 
        onClick={resetLiveScreen} 
      />
      
      <div className="w-px h-6 bg-white/20 mx-2" />
      
      {/* App Controls */}
      <TooltipButton 
        icon={isFullscreen ? Minimize : Maximize} 
        label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
        onClick={toggleFullscreen} 
      />
      
      <TooltipButton 
        icon={LayoutDashboard} 
        label="Organizer View" 
        onClick={() => navigate(`/analytics/${pollId}`)} 
      />

    </div>
  );
};

export default LiveControls;
