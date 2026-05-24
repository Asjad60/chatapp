import { redis } from "../index.js";

export const getCacheData = async (key) => {
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.warn("Redis fetch error", e.message);
    return null;
  }
};

export const setCacheData = async (key, ttl, value) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (e) {
    console.warn("Redis set error", e.message);
  }
};

export const deleteCacheData = async (key) => {
  try {
    await redis.del(key);
  } catch (e) {
    console.warn("Redis delete error", e.message);
  }
};
