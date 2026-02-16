import { envs } from '@shopu/config/config';
import { Redis } from 'ioredis';

const REDIS_URL = envs.REDIS_URL;

let redisClient: Redis | null = null;

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const connectToRedis = async (): Promise<Redis> => {
  try {
    if (globalForRedis.redis) {
      redisClient = globalForRedis.redis;
      return redisClient;
    }

    if (!REDIS_URL) {
      throw new Error('REDIS_URL is required in environment variable');
    }

    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(error) {
        const targetError = 'READONLY';
        if (error.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    client.on('connect', () => {
      console.log('Redis connecting');
    });

    client.on('ready', () => {
      console.log('Redis is connected and ready');
    });

    client.on('error', err => {
      console.log('Redis error', err);
    });

    client.on('reconnecting', () => {
      console.log('Redis reconnecting');
    });

    if (typeof process !== 'undefined') {
      process.on('SIGINT', async () => {
        await client.quit();
        process.exit(0);
      });
    }

    process.on('SIGTERM', async () => {
      await client.quit();
      process.exit(0);
    });

    redisClient = client;
    return client;
  } catch (error) {
    console.error(String(error));
    throw error;
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client is not initialize, call connectToRedis() first.');
  }

  return redisClient;
};

export { Redis };
