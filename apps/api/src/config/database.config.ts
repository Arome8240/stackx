import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/stackx',
  options: {
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE ?? '10', 10),
    minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE ?? '2', 10),
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
}));
