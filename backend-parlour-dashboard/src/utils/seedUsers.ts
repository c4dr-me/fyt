import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

async function seed() {
  await mongoose.connect(MONGO_URI);

  const users = [
    {
      name: 'Super Admin',
      email: 'superadmin@parlour.com',
      password: 'superadmin123',
      role: 'superadmin',
    },
    {
      name: 'Admin',
      email: 'admin@parlour.com',
      password: 'admin123',
      role: 'admin',
    },
  ];

  for (const user of users) {
    const exists = await User.findOne({ email: user.email });
    if (!exists) {
      await User.create(user);
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed(); 