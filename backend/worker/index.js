const kafka = require('../config/kafka');
const messageProcessor = require('./messageProcessor');
// require('../config/db'); // Initialize MongoDB connection

class ChatWorker {
  constructor() {
    this.consumer = kafka.consumer({ groupId: 'chat-worker-group' });
  }

  async initialize() {
    try {
      console.log('🔄 Initializing Chat Worker...');
      await this.consumer.connect();
      console.log('✅ Kafka Consumer connected');

      await this.consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });
      console.log('✅ Subscribed to topic: chat-messages');

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const parsedMessage = JSON.parse(message.value.toString());
            await messageProcessor.process(parsedMessage);
          } catch (err) {
            console.error('❌ Failed to parse or process message:', err);
            // Handle poison pill messages
          }
        },
      });
    } catch (error) {
      console.error('❌ Error initializing Chat Worker:', error);
      process.exit(1);
    }
  }
}

const worker = new ChatWorker();
worker.initialize();