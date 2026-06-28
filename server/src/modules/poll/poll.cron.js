import cron from 'node-cron';
import Poll from './poll.model.js';
import { emitLiveAnalyticsUpdate } from '../../emitters.js';

/**
 * Initialize Poll related cron jobs.
 * This should be imported and called in the main server index/app file.
 */
export const initPollCronJobs = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find all polls that are SCHEDULED and their scheduled date has passed
      const pollsToPublish = await Poll.find({
        status: 'SCHEDULED',
        scheduledPublishDate: { $lte: now },
      });

      if (pollsToPublish.length > 0) {
        for (const poll of pollsToPublish) {
          poll.status = 'PUBLISHED';
          poll.isResultsPublished = true;
          await poll.save();
          
          // Emit socket event for presentation mode
          emitLiveAnalyticsUpdate(poll._id);
        }

        console.log(`[Cron] Auto-published ${pollsToPublish.length} scheduled poll(s) at ${now.toISOString()}`);
      }

      // Find all polls that just expired
      const expiredPolls = await Poll.find({
        status: { $ne: 'EXPIRED' },
        expiryDate: { $lte: now },
      });

      if (expiredPolls.length > 0) {
        for (const poll of expiredPolls) {
          poll.status = 'EXPIRED';
          await poll.save();
          
          // Emit socket event for presentation mode
          emitLiveAnalyticsUpdate(poll._id);
        }

        console.log(`[Cron] Auto-expired ${expiredPolls.length} poll(s) at ${now.toISOString()}`);
      }
    } catch (error) {
      console.error('[Cron Error] Failed to process scheduled polls:', error);
    }
  });

  console.log('[Cron] Poll scheduler initialized');
};
