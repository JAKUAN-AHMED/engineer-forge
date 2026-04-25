import mongoose from 'mongoose';
import { env } from '../env';

export async function connectDb(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI);
  console.log('[db] connected:', env.MONGO_URI);
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
