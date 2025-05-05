// services/redisClient.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

class RedisClient {
  constructor() {
    this.client = null;
    this.defaultExpiration = 3600; // 1 hour default expiration
  }

  async connect() {
    try {
      this.client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      this.client.on("connect", () => {
        console.log("Redis client connected");
      });

      this.client.on("error", (err) => {
        console.error("Redis client error:", err);
      });

      return this.client;
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis GET error:", error);
      return null;
    }
  }

  async set(key, value, expiration = this.defaultExpiration) {
    try {
      await this.client.set(key, JSON.stringify(value), "EX", expiration);
      return true;
    } catch (error) {
      console.error("Redis SET error:", error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error("Redis DEL error:", error);
      return false;
    }
  }

  async flush() {
    try {
      await this.client.flushall();
      return true;
    } catch (error) {
      console.error("Redis FLUSH error:", error);
      return false;
    }
  }

  // Helper method to generate cache keys
  generateKey(prefix, identifier) {
    return `${prefix}:${identifier}`;
  }

  // Check if Redis is connected
  isConnected() {
    return this.client && this.client.status === "ready";
  }
}

export default new RedisClient();
