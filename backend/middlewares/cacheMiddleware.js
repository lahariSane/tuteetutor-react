// middleware/cacheMiddleware.js
import redisClient from "../services/redisClient.js";

const cacheMiddleware = (options = {}) => {
  const {
    expiration = 3600, // 1 hour default
    keyPrefix = "cache",
    generateKey = (req) => `${req.originalUrl}`, // Default key generator
  } = options;

  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Check if Redis is connected
    if (!redisClient.isConnected()) {
      console.warn("Redis not connected, skipping cache");
      return next();
    }

    const key = redisClient.generateKey(keyPrefix, generateKey(req));

    try {
      // Try to get data from cache
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log(`Cache hit for key: ${key}`);
        return res.json(cachedData);
      }

      console.log(`Cache miss for key: ${key}`);

      // Store the original send function
      const originalSend = res.send;

      // Override the send function to cache the response
      res.send = function (body) {
        // Restore the original send function
        res.send = originalSend;

        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsedBody = JSON.parse(body);
            redisClient.set(key, parsedBody, expiration);
          } catch (error) {
            console.error("Failed to parse response body for caching:", error);
          }
        }

        // Send the response
        return res.send(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

// Cache invalidation helper
export const invalidateCache = async (pattern) => {
  try {
    const keys = await redisClient.client.keys(pattern);

    if (keys.length > 0) {
      await redisClient.client.del(keys);
      console.log(
        `Invalidated ${keys.length} cache keys matching pattern: ${pattern}`,
      );
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};

export default cacheMiddleware;
