import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Loader2, ArrowRight } from 'lucide-react';
import { getPollLeaderboard } from '../../api/poll.api';

const LeaderboardView = ({ pollId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await getPollLeaderboard(pollId);
        setLeaderboard(data || []);
      } catch (err) {
        setError('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [pollId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Calculating final scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 font-bold">{error}</div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Responses Yet</h3>
        <p className="text-gray-500">Wait for participants to answer questions to see the leaderboard.</p>
      </div>
    );
  }

  // Get Top 3 for Podium
  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3, 10);

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30';
    if (rank === 2) return 'text-gray-400 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700';
    if (rank === 3) return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30';
    return 'text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800';
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-amber-500 mb-4 tracking-tight">
          Leaderboard
        </h1>
        <p className="text-xl font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
          Top 10 Players
        </p>
      </div>

      {/* Podium for Top 3 */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-4 sm:gap-8 mb-16 h-64">
          
          {/* Second Place */}
          {top3[1] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className="text-center mb-4 px-2">
                <span className="block font-bold text-lg sm:text-xl text-gray-900 dark:text-white truncate max-w-[120px]">{top3[1].name}</span>
                <span className="font-black text-orange-500">{top3[1].score} pts</span>
              </div>
              <div className="w-24 sm:w-32 h-32 bg-gradient-to-t from-gray-200 to-gray-100 dark:from-zinc-800 dark:to-zinc-700 rounded-t-xl flex justify-center border-t border-x border-gray-300 dark:border-zinc-600 relative shadow-lg">
                <div className="absolute -top-6 w-12 h-12 bg-white dark:bg-zinc-900 rounded-full shadow-md flex items-center justify-center border-4 border-gray-200 dark:border-zinc-700">
                  <span className="text-xl font-black text-gray-500">2</span>
                </div>
              </div>
            </div>
          )}

          {/* First Place */}
          {top3[0] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-10">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-md" />
              </div>
              <div className="text-center mb-4 px-2">
                <span className="block font-black text-2xl sm:text-3xl text-gray-900 dark:text-white truncate max-w-[150px]">{top3[0].name}</span>
                <span className="font-black text-xl text-orange-500">{top3[0].score} pts</span>
              </div>
              <div className="w-28 sm:w-36 h-48 bg-gradient-to-t from-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-700/40 rounded-t-xl flex justify-center border-t-2 border-x border-yellow-300 dark:border-yellow-600 relative shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <div className="absolute -top-6 w-14 h-14 bg-white dark:bg-zinc-900 rounded-full shadow-lg flex items-center justify-center border-4 border-yellow-400">
                  <span className="text-2xl font-black text-yellow-500">1</span>
                </div>
              </div>
            </div>
          )}

          {/* Third Place */}
          {top3[2] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="text-center mb-4 px-2">
                <span className="block font-bold text-lg sm:text-xl text-gray-900 dark:text-white truncate max-w-[120px]">{top3[2].name}</span>
                <span className="font-black text-orange-500">{top3[2].score} pts</span>
              </div>
              <div className="w-24 sm:w-32 h-24 bg-gradient-to-t from-amber-200 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 rounded-t-xl flex justify-center border-t border-x border-amber-300 dark:border-amber-700/50 relative shadow-lg">
                <div className="absolute -top-6 w-12 h-12 bg-white dark:bg-zinc-900 rounded-full shadow-md flex items-center justify-center border-4 border-amber-400">
                  <span className="text-xl font-black text-amber-600">3</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List for 4th to 10th Place */}
      {others.length > 0 && (
        <div className="w-full max-w-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {others.map((player) => (
            <div 
              key={player.responseId}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border ${getRankColor(player.rank)} transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center font-bold">
                  #{player.rank}
                </div>
                <span className="font-bold text-lg">{player.name}</span>
              </div>
              <div className="font-black">
                {player.score} <span className="text-sm font-bold opacity-70">pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardView;
