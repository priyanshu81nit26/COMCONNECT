const Redis = require('ioredis');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 2000, 10000);
    console.log(` Redis connection attempt ${times}, retrying in ${delay}ms`);
    return delay;
  }
};

console.log('🔄 Initializing Redis with config:', redisConfig);
const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => console.log('✅ Redis client connecting...'));
redisClient.on('ready', () => console.log('✅ Redis connection established'));
redisClient.on('error', (err) => console.error('❌ Redis Error:', err.message));
redisClient.on('close', () => console.log('❌ Redis connection closed'));
redisClient.on('reconnecting', (ms) => console.log(`🔄 Redis reconnecting in ${ms}ms`));

// Export a single instance for the application
module.exports = redisClient;