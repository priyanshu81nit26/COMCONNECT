const admin = require('../config/firebase');
const { Kafka } = require('kafkajs');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

console.log('Starting NotificationService with config:', {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  kafkaBroker: process.env.KAFKA_BROKER
});

console.log("debugging");

// ========================
// Redis Configuration
// ========================
const redisConfig = {
  host: process.env.REDIS_HOST || 'ec2-3-6-113-80.ap-south-1.compute.amazonaws.com',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 2000, 10000);
    console.log(`⏳ Redis connection attempt ${times}, retrying in ${delay}ms`);
    return delay;
  }
};

console.log('Initializing Redis with config:', redisConfig);
const redis = new Redis(redisConfig);

// Enhanced Redis event listeners
redis.on('connect', () => {
  console.log('✅ Redis connecting to:', redisConfig.host);
});

redis.on('ready', () => {
  console.log('✅ Redis connection established');
});

redis.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
  console.error('Redis Config:', redisConfig);
});

redis.on('close', () => {
  console.log('❌ Redis connection closed');
});

redis.on('reconnecting', (ms) => {
  console.log(`🔄 Redis reconnecting in ${ms}ms`);
});

// Test connection function
async function testRedisConnection() {
  try {
    console.log('🔄 Testing Redis connection...');
    const result = await redis.ping();
    console.log('Redis ping result:', result);
    return result === 'PONG';
  } catch (error) {
    console.error('❌ Redis connection test failed:', error.message);
    return false;
  }
}

// ========================
// Kafka Configuration
// ========================
const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'ec2-3-6-113-80.ap-south-1.compute.amazonaws.com:9092'],
  connectionTimeout: 30000,
  retry: {
    initialRetryTime: 100,
    maxRetryTime: 30000,
    retries: 8
  }
};

console.log('Initializing Kafka with config:', kafkaConfig);
const kafka = new Kafka(kafkaConfig);

// ========================
// Notification Service
// ========================
class NotificationService {
  constructor() {
    this.redis = redis;
    this.producer = null;
    this.consumer = null;
    this.kafkaConnected = false;
    this.initialize();

    // Worker loop for buffered notifications
    setInterval(() => this.processBufferedNotifications(), 10000);
  }

  async initialize() {
    try {
      console.log('🔄 Initializing NotificationService...');
      
      // Initialize Kafka clients
      this.producer = kafka.producer();
      this.consumer = kafka.consumer({ 
        groupId: process.env.KAFKA_GROUP_ID || 'notification-group' 
      });

      // Connect to Kafka
      await this.producer.connect();
      this.kafkaConnected = true;
      console.log('✅ Kafka Producer connected');
      
      await this.consumer.connect();
      console.log('✅ Kafka Consumer connected');
      
      // Subscribe to topics
      await this.consumer.subscribe({ 
        topics: ['notifications'] 
      });
      console.log('✅ Subscribed to Kafka topics');

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log('Received message:', {
            topic,
            value: message.value.toString()
          });
        },
      });

      console.log('✅ NotificationService initialized successfully');
    } catch (error) {
      this.kafkaConnected = false;
      console.error('❌ Error initializing NotificationService:', error);
      console.error('Connection details:', {
        redisConfig,
        kafkaConfig,
        error: error.message
      });
    }
  }

  async testConnections() {
    try {
      const redisPing = await this.redis.ping();
      
      return {
        redis: redisPing === 'PONG',
        kafka: this.kafkaConnected,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Connection test error:', error);
      return {
        redis: false,
        kafka: this.kafkaConnected,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ========================
  // Redis Ingestion Control
  // ========================
  async isRateLimited(userId, limit = 5, windowSeconds = 60) {
    const key = `rate:user:${userId}`;
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, windowSeconds);
    }
    return count > limit;
  }

  async isDuplicate(notificationId, ttlSeconds = 60) {
    const key = `dedup:${notificationId}`;
    const added = await this.redis.set(key, "1", "EX", ttlSeconds, "NX");
    return added === null;
  }

  async bufferNotification(notification) {
    const key = `buffer:notifications`;
    await this.redis.lpush(key, JSON.stringify(notification));
    console.log("📦 Notification buffered in Redis (Kafka down).");
  }

  async processBufferedNotifications() {
    const key = `buffer:notifications`;
    while (true) {
      const notification = await this.redis.rpop(key);
      if (!notification) break;

      try {
        await this.queueNotification(JSON.parse(notification));
        console.log("✅ Reprocessed buffered notification.");
      } catch (err) {
        console.error("❌ Failed to reprocess buffered notification:", err.message);
        await this.redis.rpush(key, notification);
        break;
      }
    }
  }

  // ========================
  // Main Notification Flow
  // ========================
  async sendNotification(notification) {
    const { userId, title, body, data } = notification;
    const fcmToken = await this.getFCMToken(userId);

    console.log('📤 Sending notification to user:', userId);
    console.log('📱 FCM Token:', fcmToken);

    if (!fcmToken) {
      console.log('❌ No FCM token found for user:', userId);
      return;
    }

    const message = {
      token: fcmToken,
      notification: { title, body },
      data: {
        ...data,
        chatId: (data?.chatId || '').toString(),
        messageId: (data?.messageId || '').toString(),
        type: (data?.type || 'message').toString(),
      },
      webpush: {
        headers: { Urgency: 'high' },
        notification: {
          title,
          body,
          icon: '/icon.png',
          badge: '/badge.png',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          actions: [
            { action: 'open', title: 'Open Chat' }
          ]
        },
        fcm_options: {
          link: data?.chatId ? `/chat/${data.chatId}` : '/'
        }
      },
      android: { priority: 'high' },
    };

    try {
      console.log('📤 Sending FCM message:', message);
      const response = await admin.messaging().send(message);
      console.log('✅ FCM notification sent successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sending FCM notification:', error);
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        console.log('🔄 Removing invalid token for user:', userId);
        await this.redis.del(`user:${userId}:fcmToken`);
      }
      throw error;
    }
  }

  async queueNotification(notification) {
    try {
      const { userId, messageId, chatId } = notification;

      // Ingestion control checks
      const uniqueId = `${userId}:${chatId}:${messageId}`;
      if (await this.isDuplicate(uniqueId)) {
        console.log(`⚠️ Duplicate notification ignored: ${uniqueId}`);
        return;
      }

      if (await this.isRateLimited(userId)) {
        console.log(`⚠️ User ${userId} is rate limited. Notification dropped.`);
        return;
      }

      // Verify Kafka connection first
      try {
        await this.producer.send({
          topic: 'test-topic',
          messages: [{ value: 'test message' }],
        });
      } catch (error) {
        console.log('❌ Kafka producer not connected. Reconnecting...');
        await this.producer.connect();
      }

      // Send notification to Kafka
      await this.producer.send({
        topic: 'chat-notifications',
        messages: [
          {
            key: notification.userId,
            value: JSON.stringify(notification),
            headers: {
              timestamp: Date.now().toString()
            }
          },
        ],
      });

      console.log('✅ Notification queued successfully');
    } catch (error) {
      console.error('❌ Failed to queue notification:', error);
      await this.bufferNotification(notification); // buffer if failed
      await this.sendNotification(notification);   // direct fallback
    }
  }

  async cacheUserToken(userId, fcmToken) {
    await this.redis.set(`user:${userId}:fcmToken`, fcmToken);
  }

  async getFCMToken(userId) {
    return await this.redis.get(`user:${userId}:fcmToken`);
  }
}

// Export a single instance
const notificationService = new NotificationService();
module.exports = notificationService;
