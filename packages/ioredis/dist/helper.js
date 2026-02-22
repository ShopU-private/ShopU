import { getRedisClient } from './index.js';
export const cache = {
    /**
     * @param token -> takes the token value of the cached data
     * @returns -> returns the cached data or null in case of any failure
     */
    async get(token) {
        const redis = getRedisClient();
        const value = await redis.get(token);
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch (error) {
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
    async set(key, value, ttl) {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            const redis = getRedisClient();
            if (ttl) {
                await redis.setex(key, ttl, stringValue);
            }
            else {
                await redis.set(key, stringValue);
            }
            return true;
        }
        catch (error) {
            console.error(`Redis set error ${key}`, error);
            return false;
        }
    },
    /**
     * @param key -> takes the data of the cached data
     * @returns -> true if data deleted and false if not
     */
    async delete(key) {
        try {
            const redis = getRedisClient();
            await redis.del(key);
            return true;
        }
        catch (error) {
            console.error(`Redis delete error ${key}`, error);
            return false;
        }
    },
    /**
     * @param keys
     * @returns
     */
    async deleteMany(keys) {
        try {
            const redis = getRedisClient();
            if (keys.length === 0)
                return 0;
            return await redis.del(...keys);
        }
        catch (error) {
            console.error(`Redis delete many error ${keys}`, error);
            return 0;
        }
    },
    async exists(key) {
        try {
            const redis = getRedisClient();
            const result = await redis.exists(key);
            return result === 1;
        }
        catch (error) {
            console.error(`Redis exists error ${key}`, error);
            return false;
        }
    },
    async expire(key, seconds) {
        try {
            const redis = getRedisClient();
            const result = await redis.expire(key, seconds);
            return result === 1;
        }
        catch (error) {
            console.error(`Redis expire error: ${key}`, error);
            return false;
        }
    },
    async ttl(key) {
        try {
            const redis = getRedisClient();
            return await redis.ttl(key);
        }
        catch (error) {
            console.error(`Redis ttl error: ${key}`, error);
            return 0;
        }
    },
    async getAndDelete(key) {
        try {
            const redis = getRedisClient();
            const value = await redis.getdel(key);
            if (!value)
                return null;
            try {
                return JSON.parse(value);
            }
            catch (error) {
                return value;
            }
        }
        catch (error) {
            console.error(`Redis get and delete error: ${key}`, error);
            return null;
        }
    },
    async incrementBy(key, by = 1) {
        try {
            const redis = getRedisClient();
            return await redis.incrby(key, by);
        }
        catch (error) {
            console.log(`Redis incrementBy error: ${key}`, error);
            throw error;
        }
    },
    async decrementBy(key, by = 1) {
        try {
            const redis = getRedisClient();
            return await redis.decrby(key, by);
        }
        catch (error) {
            console.error(`Redis decrementBy error: ${key}`, error);
            throw error;
        }
    },
};
