import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../../models/User';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/w3_backend';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminPassword123';

const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'hemanttestengineer@gmail.com';
    const adminUsername = 'admin_hemant';

    // Check if admin already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('Admin user already exists. Skipping seeding.');
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    // Create admin user
    const adminUser = new User({
      email: adminEmail,
      username: adminUsername,
      password_hash: password_hash,
      role: 'ADMIN',
    });

    await adminUser.save();
    console.log('Admin user seeded successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', ADMIN_PASSWORD);

    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
