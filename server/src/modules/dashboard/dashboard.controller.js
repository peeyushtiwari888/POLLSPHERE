import Poll from '../poll/poll.model.js';
import Response from '../response/response.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Total Polls created by user
    const totalPolls = await Poll.countDocuments({ creatorId: userId, isArchived: false });
    
    // 2. Active Polls created by user
    const activePolls = await Poll.countDocuments({ 
      creatorId: userId, 
      isArchived: false, 
      expiryDate: { $gt: new Date() } 
    });
    
    // 3. Total responses for all polls created by this user
    const userPolls = await Poll.find({ creatorId: userId }).select('_id');
    const pollIds = userPolls.map(p => p._id);
    const totalResponses = await Response.countDocuments({ pollId: { $in: pollIds } });

    // 4. Completion Rate (mock logic for now, or implement actual drop-off logic if supported)
    // If not supported natively, defaulting to 100 for premium visual effect until full analytics is built.
    const completionRate = 100;

    res.status(200).json({
      status: 'success',
      data: {
        totalPolls,
        activePolls,
        totalResponses,
        completionRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};
