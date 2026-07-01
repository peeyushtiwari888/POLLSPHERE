import React, { useEffect, useState } from 'react';
import { Clock, Trophy, Timer, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { getParticipantStats } from '../../api/publicPoll.api';

const PollExpired = ({ poll }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const participantId = localStorage.getItem('poll_participant_id');
        if (participantId && poll?._id) {
          const participantStats = await getParticipantStats(poll._id, participantId);
          setStats(participantStats);
        }
      } catch (error) {
        console.error("Failed to fetch participant stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [poll?._id]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-zinc-800"
    >
      <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="w-10 h-10 text-orange-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Poll Closed
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        This poll is no longer accepting new responses. Thank you for participating!
      </p>

      {/* Stats Section */}
      {!isLoading && stats && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-500/10 dark:to-orange-500/5 rounded-2xl border border-orange-200/50 dark:border-orange-500/20"
        >
          <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-6">
            Your Performance
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-xl shadow-sm border border-orange-100 dark:border-orange-500/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 mx-auto mb-2">
                <Trophy className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                #{stats.rank}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                of {stats.totalParticipants}
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-xl shadow-sm border border-orange-100 dark:border-orange-500/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto mb-2">
                <Timer className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {stats.avgTimeTaken}s
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                Avg. Time
              </p>
            </div>

            <div className="col-span-2 bg-white dark:bg-zinc-900/50 p-4 rounded-xl shadow-sm border border-orange-100 dark:border-orange-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Target className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Score</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.score} pts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {poll?.isResultsPublished && (
        <a 
          href={`/results/${poll._id}`}
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors w-full"
        >
          View Final Results
        </a>
      )}
    </motion.div>
  );
};

export default PollExpired;
