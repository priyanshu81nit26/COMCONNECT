const { Kafka } = require('kafkajs');

const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'chat-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  connectionTimeout: 30000,
  retry: {
    initialRetryTime: 100,
    maxRetryTime: 30000,
    retries: 8
  }
};

console.log('🔄 Initializing Kafka with config:', kafkaConfig);
const kafka = new Kafka(kafkaConfig);

module.exports = kafka;