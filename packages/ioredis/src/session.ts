import { Session, SessionData } from '@shopu/types-store/types';
import { cache } from './helper.js';
import { getRedisClient } from './index.js';

const SESSION_PREFIX = 'session';
const DEFAULT_TTL = 7 * 24 * 60 * 60;

export const sessionManager = {
  async create(sessionId: string, data: SessionData, ttl: number = DEFAULT_TTL): Promise<boolean> {
    try {
      const now = Date.now();
      const session: Session = {
        sessionId,
        data,
        createdAt: now,
        expiresAt: now + ttl * 1000,
      };

      const key = `${SESSION_PREFIX}:${sessionId}`;
      return await cache.set(key, session, ttl);
    } catch (error) {
      console.error(`Redis create session error: ${sessionId}`, error);
      return false;
    }
  },

  async delete(sessionId: string): Promise<boolean> {
    try {
      const key = `${SESSION_PREFIX}:${sessionId}`;
      return await cache.delete(key);
    } catch (error) {
      console.error(`Redis delete session error: ${sessionId}`, error);
      return false;
    }
  },

  async get(sessionId: string): Promise<Session | null> {
    try {
      const key = `${SESSION_PREFIX}:${sessionId}`;
      const session = await cache.get<Session>(key);

      if (!session) return null;

      if (session.expiresAt < Date.now()) {
        await this.delete(sessionId);
        return null;
      }

      return session;
    } catch (error) {
      console.error(`Redis get session error: ${sessionId}`, error);
      return null;
    }
  },

  async update(sessionId: string, data: Partial<SessionData>): Promise<boolean> {
    try {
      const session = await this.get(sessionId);
      if (!session) return false;

      const updatedData: SessionData = {
        ...session.data,
        ...data,
      };

      const updatedSession: Session = {
        ...session,
        data: updatedData,
      };

      const key = `${SESSION_PREFIX}:${sessionId}`;
      const ttl = await cache.ttl(key);

      const newTtl = ttl > 0 ? ttl : DEFAULT_TTL;

      return await cache.set(key, updatedSession, newTtl);
    } catch (error) {
      console.error(`Redis update session error: ${sessionId}`, error);
      return false;
    }
  },

  async refresh(sessionId: string, ttl: number = DEFAULT_TTL): Promise<boolean> {
    try {
      const session = await this.get(sessionId);
      if (!session) return false;

      const updatedSession: Session = {
        ...session,
        expiresAt: Date.now() + ttl * 1000,
      };

      const key = `${SESSION_PREFIX}:${sessionId}`;
      return await cache.set(key, updatedSession, ttl);
    } catch (error) {
      console.error(`Redis refresh error: ${sessionId}`, error);
      return false;
    }
  },

  async deleteMany(sessionIds: string[]): Promise<number> {
    try {
      const keys = sessionIds.map(id => `${SESSION_PREFIX}:${id}`);

      return await cache.deleteMany(keys);
    } catch (error) {
      console.error(`Redis delete many error: ${sessionIds}`, error);
      return 0;
    }
  },

  async exists(sessionId: string): Promise<boolean> {
    try {
      const session = await this.get(sessionId);
      return session !== null;
    } catch (error) {
      console.error(`Redis exists error: ${sessionId}`, error);
      return false;
    }
  },

  async getTTL(sessionId: string): Promise<number> {
    try {
      const key = `${SESSION_PREFIX}:${sessionId}`;
      return await cache.ttl(key);
    } catch (error) {
      console.error(`Redis error in getTTL: ${sessionId}`, error);
      return -2;
    }
  },

  async getUserSessions(userId: string): Promise<string[]> {
    try {
      const pattern = `${SESSION_PREFIX}:*`;
      const sessionIds: string[] = [];
      const redis = getRedisClient();

      let count = '0';
      do {
        const [nextCount, keys] = await redis.scan(count, 'MATCH', pattern, 'COUNT', 100);
        count = nextCount;

        for (const key of keys) {
          const session = await cache.get<Session>(key);
          if (session && session.data.id === userId) {
            const sessionId = key.replace(`${SESSION_PREFIX}:`, '');
            sessionIds.push(sessionId);
          }
        }
      } while (count !== '0');

      return sessionIds;
    } catch (error) {
      console.error(`Redis in getting user sessions: ${userId}`, error);
      return [];
    }
  },
};
