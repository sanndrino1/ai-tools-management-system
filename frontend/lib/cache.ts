// lib/cache.ts - Redis caching layer
import { NextRequest, NextResponse } from 'next/server';

// Mock Redis implementation (in production use actual Redis)
class MockRedis {
  private storage: Map<string, { value: any; expiry: number | null }> = new Map();

  async set(key: string, value: any, expirationInSeconds?: number): Promise<void> {
    const expiry = expirationInSeconds ? Date.now() + (expirationInSeconds * 1000) : null;
    this.storage.set(key, { value: JSON.stringify(value), expiry });
    console.log(`🔧 Cache SET: ${key} (TTL: ${expirationInSeconds || 'no expiry'}s)`);
  }

  async get(key: string): Promise<any> {
    const item = this.storage.get(key);
    
    if (!item) {
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    }

    if (item.expiry && Date.now() > item.expiry) {
      this.storage.delete(key);
      console.log(`⏰ Cache EXPIRED: ${key}`);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
    return JSON.parse(item.value);
  }

  async del(key: string): Promise<void> {
    this.storage.delete(key);
    console.log(`🗑️ Cache DELETE: ${key}`);
  }

  async flush(): Promise<void> {
    this.storage.clear();
    console.log(`🧹 Cache FLUSH: All keys deleted`);
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return Array.from(this.storage.keys()).filter(key => regex.test(key));
  }
}

// Singleton cache instance
const cache = new MockRedis();

// Cache keys
export const CACHE_KEYS = {
  CATEGORIES: 'categories:all',
  CATEGORY_COUNTS: 'categories:counts',
  TOOLS_STATS: 'tools:stats',
  USER_TOOLS: (userId: string) => `user:${userId}:tools`,
  PENDING_TOOLS: 'tools:pending:count',
  AUDIT_LOGS: 'audit:logs:recent'
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  CATEGORIES: 60 * 60, // 1 hour
  STATS: 60 * 30, // 30 minutes
  USER_DATA: 60 * 15, // 15 minutes
  AUDIT_LOGS: 60 * 5 // 5 minutes
};

// Cache wrapper functions
export const cacheUtils = {
  // Get or set cached data
  async getOrSet<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttl: number = CACHE_TTL.STATS
  ): Promise<T> {
    // Try to get from cache first
    const cached = await cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    console.log(`🔄 Fetching fresh data for: ${key}`);
    const freshData = await fetchFn();
    
    // Store in cache
    await cache.set(key, freshData, ttl);
    return freshData;
  },

  // Invalidate related caches
  async invalidateByPattern(pattern: string): Promise<void> {
    const keys = await cache.keys(pattern);
    for (const key of keys) {
      await cache.del(key);
    }
  },

  // Clear specific cache
  async clear(key: string): Promise<void> {
    await cache.del(key);
  },

  // Warm up cache with fresh data
  async warmUp(): Promise<void> {
    console.log('🔥 Warming up cache...');
    
    // Warm up categories
    await this.getOrSet(CACHE_KEYS.CATEGORIES, async () => {
      return ['AI/ML', 'Development', 'Design', 'Analytics', 'Automation', 'Communication'];
    }, CACHE_TTL.CATEGORIES);

    // Warm up category counts
    await this.getOrSet(CACHE_KEYS.CATEGORY_COUNTS, async () => {
      return {
        'AI/ML': 12,
        'Development': 8,
        'Design': 6,
        'Analytics': 4,
        'Automation': 7,
        'Communication': 3
      };
    }, CACHE_TTL.STATS);

    console.log('✅ Cache warmed up successfully');
  }
};

// Cache middleware for API routes
export function withCache(ttl: number = CACHE_TTL.STATS) {
  return function cacheMiddleware(
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    return async function cachedHandler(req: NextRequest) {
      const cacheKey = `api:${req.nextUrl.pathname}:${req.nextUrl.search}`;
      
      // Only cache GET requests
      if (req.method !== 'GET') {
        return handler(req);
      }

      // Try cache first
      const cached = await cache.get(cacheKey);
      if (cached) {
        console.log(`🚀 Serving from cache: ${cacheKey}`);
        return NextResponse.json(cached);
      }

      // Execute handler
      const response = await handler(req);
      
      // Cache successful responses
      if (response.status === 200) {
        try {
          const data = await response.json();
          await cache.set(cacheKey, data, ttl);
          return NextResponse.json(data);
        } catch (error) {
          console.error('Failed to cache response:', error);
          return response;
        }
      }

      return response;
    };
  };
}

export { cache };