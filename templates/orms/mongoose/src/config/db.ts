import mongoose from 'mongoose';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mydb';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export { mongoose };
