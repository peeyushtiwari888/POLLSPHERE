import cron from 'node-cron';
import Poll from './poll.model.js';

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
      const result = await Poll.updateMany(
        {
          status: 'SCHEDULED',
          scheduledPublishDate: { $lte: now },
        },
        {
          $set: {
            status: 'PUBLISHED',
            isResultsPublished: true,
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Cron] Auto-published ${result.modifiedCount} scheduled poll(s) at ${now.toISOString()}`);
        
        // FUTURE: Dispatch notifications or Socket.io events here if needed.
        // The Notification module could be integrated here to notify the creator 
        // that their scheduled poll is now live.
      }
    } catch (error) {
      console.error('[Cron Error] Failed to process scheduled polls:', error);
    }
  });

  console.log('[Cron] Poll scheduler initialized');
};
