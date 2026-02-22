import { getRedisClient } from './index.js';
export const rateLimit = {
    async check(indentifier, maxRequest, windowSeconds, keyPrefix) {
        const redis = getRedisClient();
        const key = `${keyPrefix}:${indentifier}`;
        const now = Date.now();
        const windowStart = now - windowSeconds * 1000;
        const pipeline = redis.multi();
        pipeline.zremrangebyscore(key, 0, windowStart);
        pipeline.zadd(key, now, `${now}`);
        pipeline.zcard(key);
        pipeline.expire(key, windowSeconds);
        const [, , countResult] = (await pipeline.exec());
        const requestCount = countResult[1];
        if (requestCount > maxRequest) {
            const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
            const resetTime = Number(oldest[1]) + windowSeconds * 1000;
            return {
                allowed: false,
                remaining: 0,
                resetTime,
                retryAfter: Math.ceil((resetTime - now) / 1000),
            };
        }
        return {
            allowed: true,
            remaining: maxRequest - requestCount,
            resetTime: now + windowSeconds * 1000,
        };
    },
};
