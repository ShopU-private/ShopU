import { RateLimitResult } from '@shopu/types-store/types';
export declare const rateLimit: {
    check(indentifier: string, maxRequest: number, windowSeconds: number, keyPrefix: "rateLimit"): Promise<RateLimitResult>;
};
//# sourceMappingURL=rateLimit.d.ts.map