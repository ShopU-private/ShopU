import { getRedisClient } from './index.js';

export const pubsub = {
  async publisher(channel: string, message: string): Promise<number> {
    try {
      const redis = getRedisClient();
      return await redis.publish(channel, message);
    } catch (error) {
      console.error('Redis publish error', String(error));
      throw error;
    }
  },

  async subscriber(
    channels: string | string[],
    callback: (channel: string, message: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const redis = getRedisClient();
        const subscriber = redis.duplicate();
        const channelArray = Array.isArray(channels) ? channels : [channels];
        subscriber.subscribe(...channelArray, err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });

        subscriber.on('message', (channel, message) => {
          callback(channel, message);
        });

        subscriber.on('error', error => {
          console.error('Redis subscribe error', String(error));
        });
      } catch (error) {
        reject(error);
        throw error;
      }
    });
  },
};
