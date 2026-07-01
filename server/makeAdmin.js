import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './src/modules/auth/auth.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env variables
dotenv.config({ path: join(__dirname, '.env') });

const makeAdmin = async (email) => {
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database');

    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Success! User ${user.username} (${user.email}) is now an ADMIN.`);
    } else {
      console.log(`Error: No user found with email ${email}`);
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

const emailArg = process.argv[2];
makeAdmin(emailArg);
