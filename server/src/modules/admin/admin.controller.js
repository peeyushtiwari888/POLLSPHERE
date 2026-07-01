import ActivityLog from './activityLog.model.js';
import User from '../auth/auth.model.js';
import Poll from '../poll/poll.model.js';
import Event from '../event/event.model.js';

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPolls = await Poll.countDocuments();
    const totalActivities = await ActivityLog.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPolls,
        totalActivities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
  }
};

export const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    // Fetch logs sorted by newest first, and populate user name/email
    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email username avatarUrl');

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activities' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    // Fetch all users
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot block an admin user' });
    }
    
    user.isBlocked = !user.isBlocked;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      data: user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle block status' });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('creatorId', 'name username email');
      
    res.status(200).json({ success: true, data: polls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch polls' });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('createdBy', 'name username email');
      
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

// A helper endpoint to make yourself an admin (secret)
// In production, you would remove or heavily secure this
export const promoteToAdmin = async (req, res) => {
  try {
    const { secret, userId } = req.body;
    
    // Use a hardcoded secret or env variable (fallback to a hardcoded string for demo)
    const expectedSecret = process.env.ADMIN_SECRET || 'supersecretadmin';
    
    if (secret !== expectedSecret) {
      return res.status(403).json({ success: false, message: 'Invalid secret' });
    }

    const user = await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User promoted to admin', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to promote user' });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findByIdAndDelete(id);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }
    res.status(200).json({ success: true, message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete poll' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
};

export const toggleAdminRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }
    
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: `User role updated to ${user.role}`,
      data: user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
};
