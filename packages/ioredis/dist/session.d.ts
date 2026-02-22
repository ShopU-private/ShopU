import { Session, SessionData } from '@shopu/types-store/types';
export declare const sessionManager: {
    create(sessionId: string, data: SessionData, ttl?: number): Promise<boolean>;
    delete(sessionId: string): Promise<boolean>;
    get(sessionId: string): Promise<Session | null>;
    update(sessionId: string, data: Partial<SessionData>): Promise<boolean>;
    refresh(sessionId: string, ttl?: number): Promise<boolean>;
    deleteMany(sessionIds: string[]): Promise<number>;
    exists(sessionId: string): Promise<boolean>;
    getTTL(sessionId: string): Promise<number>;
    getUserSessions(userId: string): Promise<string[]>;
};
//# sourceMappingURL=session.d.ts.map