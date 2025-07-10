import { NextRequest } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (identifier: string): RateLimitResult => {
      const now = Date.now();
      const key = identifier;
      
      // Clean up expired entries
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime <= now) {
          rateLimitStore.delete(k);
        }
      }
      
      const record = rateLimitStore.get(key);
      const resetTime = now + config.interval;
      
      if (!record) {
        // First request
        rateLimitStore.set(key, { count: 1, resetTime });
        return {
          success: true,
          limit: config.uniqueTokenPerInterval,
          remaining: config.uniqueTokenPerInterval - 1,
          reset: resetTime,
        };
      }
      
      if (record.resetTime <= now) {
        // Reset window
        rateLimitStore.set(key, { count: 1, resetTime });
        return {
          success: true,
          limit: config.uniqueTokenPerInterval,
          remaining: config.uniqueTokenPerInterval - 1,
          reset: resetTime,
        };
      }
      
      if (record.count >= config.uniqueTokenPerInterval) {
        // Rate limit exceeded
        return {
          success: false,
          limit: config.uniqueTokenPerInterval,
          remaining: 0,
          reset: record.resetTime,
        };
      }
      
      // Increment count
      record.count++;
      return {
        success: true,
        limit: config.uniqueTokenPerInterval,
        remaining: config.uniqueTokenPerInterval - record.count,
        reset: record.resetTime,
      };
    },
  };
}

// Get client identifier for rate limiting
export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from session if available
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
  
  // In production, you might want to use user ID if authenticated
  return ip;
}

// Predefined rate limiters
export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60, // 60 requests per minute
});

export const inviteRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 10, // 10 invites per hour
});

export const pusherRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // 100 events per minute
});

// Middleware helper for applying rate limits
export function withRateLimit(
  rateLimiter: ReturnType<typeof rateLimit>,
  identifier: string
): RateLimitResult {
  return rateLimiter.check(identifier);
}