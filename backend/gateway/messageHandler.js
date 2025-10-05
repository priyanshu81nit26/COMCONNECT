const { v4: uuidv4 } = require('uuid');
const kafka = require('../config/kafka');

class MessageHandler {
  constructor() {
    this.producer = kafka.producer();
    this.initialize();
  }

  async initialize() {
    try {
      await this.producer.connect();
      console.log('✅ Kafka Producer connected in MessageHandler');
    } catch (error) {
      console.error('❌ Failed to connect Kafka Producer:', error);
      // Implement a retry mechanism or crash the process
      process.exit(1);
    }
  }

 
  async process(messageData, senderId) {
    try {
      const { recipientId, content } = messageData;

      if (!recipientId || !content) {
        console.warn('⚠️ Invalid message received. Missing recipientId or content.');
        return;
      }

      // Enrich the message with server-side information
      const enrichedMessage = {
        messageId: uuidv4(),
        senderId,
        recipientId,
        content,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      // Send to Kafka
      await this.producer.send({
        topic: 'chat-messages',
        messages: [{
          key: recipientId, // Partition by recipient for ordered delivery
          value: JSON.stringify(enrichedMessage),
        }, ],
      });

      console.log(`✅ Message from ${senderId} to ${recipientId} queued.`);
      
      // Return the full message so the gateway can send an 'ack' to the sender
      return enrichedMessage;

    } catch (error) {
      console.error('❌ Error processing and queuing message:', error);
      // Optionally, implement a fallback or dead-letter queue
    }
  }
}

module.exports = new MessageHandler();