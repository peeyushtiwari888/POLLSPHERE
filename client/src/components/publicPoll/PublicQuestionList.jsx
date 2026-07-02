import React, { useState, useEffect } from 'react';
import { Loader2, Send, Clock, CheckCircle2 } from 'lucide-react';
import PublicQuestionCard from './PublicQuestionCard';
import { submitLiveAnswer } from '../../api/publicPoll.api';
import { toast } from 'react-hot-toast';
import { useAudio } from '../../hooks/useAudio';

/**
 * Public Question List (Live Presenter Mode)
 * 
 * In Live Mode, this component ONLY renders the currently active question.
 * If no question is active, it renders a "waiting for presenter" screen.
 */
const PublicQuestionList = ({ pollId, participantId, questions = [], answers = {}, setAnswers, activeQuestionId, activeQuestionStartTime, pollStatus }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState({}); // Track which questions were successfully submitted live

  const isLiveMode = pollStatus === 'PUBLISHED' || pollStatus === 'ACTIVE';

  // Audio Hooks
  const { play: playTickTock, stop: stopTickTock } = useAudio('/sounds/ticktock.wav', { volume: 0.5 });
  const { play: playCorrect } = useAudio('/sounds/correct.wav', { volume: 0.8 });
  const { play: playWrong } = useAudio('/sounds/wrong.wav', { volume: 0.8 });

  // Filter to find the active question
  const activeQuestionIndex = (questions && questions.length > 0) ? questions.findIndex(q => q._id === activeQuestionId) : -1;
  const activeQuestion = activeQuestionIndex >= 0 ? questions[activeQuestionIndex] : null;

  // Timer Logic
  useEffect(() => {
    if (!isLiveMode || !activeQuestion || !activeQuestionStartTime) {
      setTimeLeft(null);
      return;
    }

    const durationMs = (activeQuestion.duration || 30) * 1000;
    
    const updateTimer = () => {
      const elapsed = Date.now() - new Date(activeQuestionStartTime).getTime();
      const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer(); // initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isLiveMode, activeQuestion, activeQuestionStartTime]);

  // Audio effects for timer
  useEffect(() => {
    if (isLiveMode && timeLeft !== null && timeLeft <= 10 && timeLeft > 0) {
      playTickTock();
    } else {
      stopTickTock();
    }
    return () => stopTickTock();
  }, [timeLeft, isLiveMode, playTickTock, stopTickTock]);

  // Handler to safely update the answers dictionary in the parent page
  const handleAnswerChange = (questionId, value) => {
    if (setAnswers) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const handleLiveSubmit = async () => {
    if (!activeQuestion) return;
    const value = answers[activeQuestion._id];

    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      toast.error('Please select an answer first.');
      return;
    }

    setIsSubmitting(true);
    try {
      let answerPayload = { questionId: activeQuestion._id };
      
      if (activeQuestion.questionType === 'SINGLE_CHOICE') {
        answerPayload.selectedOption = value;
      } else if (activeQuestion.questionType === 'MULTI_SELECT') {
        answerPayload.selectedOptions = value;
      } else if (['OPEN_TEXT', 'WORD_CLOUD'].includes(activeQuestion.questionType)) {
        answerPayload.textValue = value;
      } else if (activeQuestion.questionType === 'RATING') {
        answerPayload.ratingValue = value;
      }

      const result = await submitLiveAnswer(pollId, participantId, answerPayload);
      
      const { scoreAwarded, isCorrect, currentRank } = result?.data || {};
      
      setSubmittedStatus(prev => ({ 
        ...prev, 
        [activeQuestion._id]: {
          submitted: true,
          scoreAwarded,
          isCorrect,
          currentRank
        } 
      }));
      toast.success('Answer submitted successfully!');
      
      // Play sound based on result (if isCorrect is undefined, assume correct/success)
      if (isCorrect === false) {
        playWrong();
      } else {
        playCorrect();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit answer');
      playWrong();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  // If no question is active, show the waiting screen
  if (!activeQuestionId) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl text-center shadow-sm animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-[-10px] border border-orange-500/30 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
          <div className="relative w-24 h-24 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <img src="/logo.png" alt="PollSphere" className="w-16 h-16 object-contain animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">PollSphere Live Session</h3>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium">
          Waiting for the presenter to publish the first question...
        </p>
      </div>
    );
  }

  if (!activeQuestion) {
    return null; // Fallback if activeQuestionId somehow doesn't match
  }

  const isTimeUp = isLiveMode && timeLeft === 0;
  const submissionData = submittedStatus[activeQuestion._id] || null;
  const isCurrentlySubmitted = !!submissionData;
  const isDisabled = isTimeUp || isCurrentlySubmitted || isSubmitting;

  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation / Progress Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex flex-wrap items-center gap-2">
        </div>
        
        {/* Live Timer Display */}
        {isLiveMode && timeLeft !== null && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold border-2 transition-colors ${
            timeLeft > 10 ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30' : 
            timeLeft > 0 ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 animate-pulse' :
            'bg-gray-100 text-gray-500 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="tabular-nums tracking-wider">{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Active Question Card */}
      <PublicQuestionCard
        key={activeQuestion._id}
        index={activeQuestionIndex + 1}
        question={activeQuestion}
        currentAnswer={answers[activeQuestion._id]}
        onAnswerChange={(value) => handleAnswerChange(activeQuestion._id, value)}
        isDisabled={isDisabled}
      />
      
      {/* Live Submission Action */}
      {isLiveMode && !isCurrentlySubmitted && (
        <div className="w-full flex justify-end mt-4">
          <button
            type="button"
            onClick={handleLiveSubmit}
            disabled={isDisabled || answers[activeQuestion._id] === undefined}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              isDisabled || answers[activeQuestion._id] === undefined
                ? 'bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_0_rgb(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : isTimeUp ? (
              <>
                <Clock className="w-5 h-5" />
                <span>Time's Up</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Results Card after submission */}
      {isLiveMode && isCurrentlySubmitted && (
        <div className="mt-4 p-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/30 transition-all shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Submitted!</h3>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">Your answer has been recorded.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Waiting for the next question...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicQuestionList;
