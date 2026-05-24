import Redis from "ioredis";

function redisConnect() {
  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB),
  });

  redis.on("connect", () => {
    console.log("redis connected");
  });

  redis.on("error", (err) => {
    console.log("redis connection error", err);
  });

  return redis;
}

export default redisConnect;
