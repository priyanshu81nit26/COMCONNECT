const connectionManager = require('../gateway/connectionManager');
const redis = require('../config/redis');
const Message = require('../models/message'); // Assuming a Mongoose model
const notificationService = require('../services/notificationService');

class MessageProcessor {
  constructor() {
    // A regular Redis client for commands (not for subscribing)
    this.redisPublisher = redis.duplicate();
  }

  /**
   * Processes a single message consumed from Kafka.
   * @param {object} message - The message object from Kafka.
   */
  async process(message) {
    console.log(`🔄 Processing message ${message.messageId} for ${message.recipientId}`);

    try {
      // 1. Persist the message to the database
      // Using updateOne with upsert is efficient for creating chat documents
      await Message.updateOne({ messageId: message.messageId }, { $set: message }, { upsert: true });
      console.log(`💾 Message ${message.messageId} saved to database.`);

      // 2. Check if the recipient is online and find their gateway
      const recipientGatewayId = await connectionManager.getUserGateway(message.recipientId);

      if (recipientGatewayId) {
        // 3a. User is online: Publish to the specific gateway's Redis channel
        const channel = `delivery-channel:${recipientGatewayId}`;
        await this.redisPublisher.publish(channel, JSON.stringify(message));
        console.log(`📢 Published message to channel ${channel} for live delivery.`);
      } else {
        // 3b. User is offline: Send a push notification
        console.log(`📴 User ${message.recipientId} is offline. Sending push notification.`);
        const notification = {
          userId: message.recipientId,
          title: `New message from ${message.senderId}`,
          body: message.content.text, // Assuming content is { text: '...' }
          data: {
            messageId: message.messageId,
            senderId: message.senderId,
            type: 'new_message',
          },
        };
        await notificationService.queueNotification(notification);
      }
    } catch (error) {
      console.error(`❌ Critical error processing message ${message.messageId}:`, error);
      // Implement a dead-letter queue or another retry strategy here
    }
  }
}

module.exports = new MessageProcessor();