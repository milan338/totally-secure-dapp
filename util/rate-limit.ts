// Adapted from https://github.com/vercel/next.js/blob/canary/examples/api-routes-rate-limit/utils/rate-limit.js
import LRU from 'lru-cache';
import type { NextApiResponse } from 'next';

type RateLimitOptions = {
    interval: number; // Rate limit in ms
    uniqueTokensPerInterval: number; // Users per interval
};

export function rateLimit(options: RateLimitOptions) {
    const { interval, uniqueTokensPerInterval } = options;
    const tokenCache = new LRU<string, Array<number>>({
        max: uniqueTokensPerInterval,
        maxAge: interval,
    });
    return {
        check: (res: NextApiResponse<Record<any, any>>, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = tokenCache.get(token) || [0];
                if (!tokenCount[0]) tokenCache.set(token, tokenCount);
                tokenCount[0]++;
                const [currentUsage] = tokenCount;
                const rateLimited = currentUsage >= limit;
                res.setHeader('X-RateLimit-Limit', limit);
                res.setHeader('X-RateLimit-Remaining', rateLimited ? 0 : limit - currentUsage);
                return rateLimited ? reject() : resolve();
            }),
    };
}
