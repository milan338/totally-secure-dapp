import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';
import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';

type RateLimitOptions = {
    max: number;
    windowMs: number;
};

function getIpAddr(req: IncomingMessage) {
    let ip =
        req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    if (Array.isArray(ip)) ip = ip[0];
    return ip ?? '';
}

export function getRateLimiter(options?: RateLimitOptions) {
    return rateLimit({ keyGenerator: getIpAddr, ...options });
}

export function checkRateLimit(
    req: NextApiRequest,
    res: NextApiResponse,
    limiter: RateLimitRequestHandler
) {
    return new Promise((resolve, reject) => {
        limiter(req as any, res as any, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}
