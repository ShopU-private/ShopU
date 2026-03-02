import { getRedisClient } from './index.js';

export const cache = {
  /**
   * @param token -> takes the token value of the cached data
   * @returns -> returns the cached data or null in case of any failure
   */
  async get<T = string>(token: string): Promise<T | null> {
    const redis = getRedisClient();
    const value = await redis.get(token);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Redis get error of key ${token}`, error);
      return null;
    }
  },

  /**
   * @param key -> takes the key to the data going to be cached
   * @param value -> takes the data in the string for caching
   * @param ttl -> takes time to live in seconds
   * @returns -> true if the data cached or false if not
   */
  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      const redis = getRedisClient();
      if (ttl) {
        await redis.setex(key, ttl, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error(`Redis set error ${key}`, error);
      return false;
    }
  },

  /**
   * @param key -> takes the data of the cached data
   * @returns -> true if data deleted and false if not
   */
  async delete(key: string): Promise<boolean> {
    try {
      const redis = getRedisClient();
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`Redis delete error ${key}`, error);
      return false;
    }
  },

  /**
   * @param keys
   * @returns
   */
  async deleteMany(keys: string[]): Promise<number> {
    try {
      const redis = getRedisClient();
      if (keys.length === 0) return 0;
      return await redis.del(...keys);
    } catch (error) {
      console.error(`Redis delete many error ${keys}`, error);
      return 0;
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const redis = getRedisClient();
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis exists error ${key}`, error);
      return false;
    }
  },

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const redis = getRedisClient();
      const result = await redis.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error(`Redis expire error: ${key}`, error);
      return false;
    }
  },

  async ttl(key: string): Promise<number> {
    try {
      const redis = getRedisClient();
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Redis ttl error: ${key}`, error);
      return 0;
    }
  },

  async getAndDelete<T = string>(key: string): Promise<T | null> {
    try {
      const redis = getRedisClient();
      const value = await redis.getdel(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        return value as T;
      }
    } catch (error) {
      console.error(`Redis get and delete error: ${key}`, error);
      return null;
    }
  },

  async incrementBy(key: string, by: number = 1): Promise<number> {
    try {
      const redis = getRedisClient();
      return await redis.incrby(key, by);
    } catch (error) {
      console.log(`Redis incrementBy error: ${key}`, error);
      throw error;
    }
  },

  async decrementBy(key: string, by: number = 1): Promise<number> {
    try {
      const redis = getRedisClient();
      return await redis.decrby(key, by);
    } catch (error) {
      console.error(`Redis decrementBy error: ${key}`, error);
      throw error;
    }
  },
};
