import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, ArrowLeft, Loader2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getPollLeaderboard } from '../api/poll.api';

/**
 * Leaderboard Page
 * 
 * Displays the Top 10 participants for a specific quiz.
 * Features a podium for the top 3 and a list for the rest.
 */
const LeaderboardPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getPollLeaderboard(pollId);
        setLeaderboard(data || []);
      } catch (error) {
        toast.error('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [pollId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4 transition-colors">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse tracking-wide">Calculating Scores...</p>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  // Pad top3 array to always have 3 slots for the podium rendering logic
  const paddedTop3 = [
    top3[1] || null, // 2nd Place (Left)
    top3[0] || null, // 1st Place (Center)
    top3[2] || null, // 3rd Place (Right)
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden relative transition-colors">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navigation */}
      <div className="w-full max-w-5xl mx-auto p-6 flex items-center justify-between relative z-10">
        <button 
          onClick={() => navigate('/polls')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Quizzes
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 relative z-10 flex flex-col items-center mt-4">
        
        {/* Title Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-2xl mb-4 border border-yellow-200 dark:border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-3 transition-colors">
            Quiz Leaderboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors">
            Top 10 players based on correct answers and points.
          </p>
        </motion.div>

        {leaderboard.length === 0 ? (
          <div className="w-full p-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl text-center shadow-sm dark:shadow-none transition-colors">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-2 transition-colors">No Responses Yet</h3>
            <p className="text-gray-500">Wait for participants to finish the quiz to see the leaderboard.</p>
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-3xl mb-16 h-80">
              {paddedTop3.map((player, index) => {
                
                // Index 0: 2nd Place, Index 1: 1st Place, Index 2: 3rd Place
                const isFirst = index === 1;
                const isSecond = index === 0;
                const isThird = index === 2;

                const heightClass = isFirst ? 'h-56' : isSecond ? 'h-44' : 'h-32';
                const bgClass = isFirst 
                  ? 'bg-gradient-to-t from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.3)]' 
                  : isSecond 
                    ? 'bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-400 dark:to-gray-300'
                    : 'bg-gradient-to-t from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600';
                
                const rankNumber = isFirst ? 1 : isSecond ? 2 : 3;
                const Icon = isFirst ? Trophy : isSecond ? Medal : Award;
                const iconColor = isFirst ? 'text-yellow-50 dark:text-yellow-100' : isSecond ? 'text-gray-600 dark:text-white' : 'text-amber-50 dark:text-amber-100';

                return (
                  <div key={index} className="flex flex-col items-center flex-1 max-w-[140px]">
                    {player && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rankNumber * 0.2 }}
                        className="flex flex-col items-center mb-4 relative w-full"
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700 flex items-center justify-center mb-2 shadow-lg overflow-hidden relative transition-colors">
                          <span className="text-xl md:text-2xl font-black text-gray-400 dark:text-gray-400">
                            {player.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white text-center truncate w-full px-1 transition-colors">
                          {player.name}
                        </span>
                        <span className="text-xs md:text-sm font-semibold text-yellow-600 dark:text-yellow-500 mt-1 flex items-center gap-1 transition-colors">
                          {player.score} <Star className="w-3 h-3 fill-current" />
                        </span>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`w-full ${heightClass} ${bgClass} rounded-t-2xl flex flex-col items-center justify-start pt-4 border-t border-white/20`}
                    >
                      <Icon className={`w-8 h-8 ${iconColor} drop-shadow-md mb-2`} />
                      <span className={`text-3xl font-black ${iconColor} drop-shadow-md`}>
                        {rankNumber}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Remaining List (Ranks 4-10) */}
            {remaining.length > 0 && (
              <div className="w-full max-w-2xl space-y-3">
                {remaining.map((player, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (idx * 0.1) }}
                    key={player.responseId}
                    className="flex items-center justify-between p-4 md:p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl hover:border-yellow-500/30 transition-colors shadow-sm dark:shadow-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-black text-gray-400 dark:text-gray-500 transition-colors">
                        {idx + 4}
                      </div>
                      <span className="font-bold text-lg text-gray-900 dark:text-white transition-colors">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-yellow-500">{player.score}</span>
                      <span className="text-sm text-gray-400 dark:text-gray-400 font-semibold uppercase tracking-wider">PTS</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
