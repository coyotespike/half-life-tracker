import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

// User ID for simple single-user setup (can be expanded later)
export const USER_ID = 'mom';

// Redis keys
export const REDIS_KEYS = {
  doses: (userId: string) => `doses:${userId}`,
  dailyCache: (userId: string, date: string) => `daily_cache:${userId}:${date}`,
} as const;