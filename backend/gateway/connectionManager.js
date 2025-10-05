const redis = require('../config/redis');

class ConnectionManager {
  constructor(redisClient) {
    this.redis = redisClient;
    // Key prefix for user-to-gateway mapping
    this.userGatewayMapPrefix = 'user:gateway:';
  }

  
  async registerUser(userId, gatewayId) {
    const key = `${this.userGatewayMapPrefix}${userId}`;
    // Set the mapping with an expiration to handle dead connections
    await this.redis.set(key, gatewayId, 'EX', 3600); // Expires in 1 hour
    console.log(`✅ User ${userId} registered to Gateway ${gatewayId}`);
  }

 
  async unregisterUser(userId) {
    const key = `${this.userGatewayMapPrefix}${userId}`;
    await this.redis.del(key);
    console.log(`🗑️ User ${userId} unregistered.`);
  }

  async getUserGateway(userId) {
    const key = `${this.userGatewayMapPrefix}${userId}`;
    return this.redis.get(key);
  }

  async refreshUserConnection(userId) {
    const key = `${this.userGatewayMapPrefix}${userId}`;
    await this.redis.expire(key, 3600); // Reset TTL to 1 hour
  }
}

// Export a singleton instance
module.exports = new ConnectionManager(redis);