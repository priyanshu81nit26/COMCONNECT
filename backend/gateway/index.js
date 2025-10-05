const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const url = require('url');
const jwt = require('jsonwebtoken'); // Example auth library

const connectionManager = require('./connectionManager');
const messageHandler = require('./messageHandler');
const redis = require('../config/redis');

// ========================
// Gateway Server Setup
// ========================
class GatewayServer {
  constructor(port) {
    this.port = port;
    // Each gateway instance gets a unique ID
    this.gatewayId = `gateway-${uuidv4()}`;
    this.server = http.createServer();
    this.wss = new WebSocketServer({ noServer: true });
    
    // Map to hold live connections on this specific gateway instance
    this.clients = new Map();

    // Dedicated Redis client for Pub/Sub
    this.redisSubscriber = redis.duplicate();
  }

  async initialize() {
    console.log(`🚀 Initializing Gateway ${this.gatewayId}...`);
    
    // Handle server upgrades (from HTTP to WebSocket)
    this.server.on('upgrade', this.handleUpgrade.bind(this));

    // Handle incoming connections
    this.wss.on('connection', this.handleConnection.bind(this));
    
    // Listen for messages from the worker via Redis Pub/Sub
    await this.subscribeToDeliveryChannel();

    this.server.listen(this.port, () => {
      console.log(`✅ WebSocket Gateway ${this.gatewayId} is listening on port ${this.port}`);
    });
  }
  
  /**
   * Authenticates the user during the WebSocket handshake.
   */
  handleUpgrade(request, socket, head) {
    const { query } = url.parse(request.url, true);
    const token = query.token;

    if (!token) {
      console.log('❌ Auth failed: No token provided.');
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // Replace with your actual token verification logic (e.g., Firebase Admin)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = { id: decoded.userId }; // Attach user to the request

      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit('connection', ws, request);
      });
    } catch (err) {
      console.log(`❌ Auth failed: Invalid token. Reason: ${err.message}`);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  }

  /**
   * Manages a new, authenticated WebSocket connection.
   */
  async handleConnection(ws, request) {
    const userId = request.user.id;
    console.log(`🤝 New connection from user ${userId} on ${this.gatewayId}`);

    // Store the connection locally
    this.clients.set(userId, ws);

    // Register user's location in Redis
    await connectionManager.registerUser(userId, this.gatewayId);

    // Handle incoming messages from this client
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        // Process message and queue to Kafka
        const ackMessage = await messageHandler.process(parsedMessage, userId);
        
        // Send an acknowledgement back to the sender
        if(ackMessage) {
            ws.send(JSON.stringify({ type: 'message_ack', ...ackMessage }));
        }

      } catch (e) {
        console.error('❌ Invalid message format:', e.message);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format.' }));
      }
    });

    // Handle connection closure
    ws.on('close', () => {
      console.log(`👋 User ${userId} disconnected from ${this.gatewayId}`);
      this.clients.delete(userId);
      connectionManager.unregisterUser(userId);
    });
    
    // Handle errors
    ws.on('error', (err) => {
        console.error(`❌ WebSocket error for user ${userId}:`, err);
    });
  }

 
  async subscribeToDeliveryChannel() {
    const channel = `delivery-channel:${this.gatewayId}`;
    await this.redisSubscriber.subscribe(channel);
    console.log(`👂 Gateway is subscribed to Redis channel: ${channel}`);

    this.redisSubscriber.on('message', (ch, message) => {
      if (ch === channel) {
        this.deliverMessage(JSON.parse(message));
      }
    });
  }

  
  deliverMessage(message) {
    const { recipientId } = message;
    const recipientSocket = this.clients.get(recipientId);

    if (recipientSocket && recipientSocket.readyState === recipientSocket.OPEN) {
      recipientSocket.send(JSON.stringify({ type: 'new_message', ...message }));
      console.log(`🚀 Delivered message ${message.messageId} to user ${recipientId}`);
    } else {
      console.warn(`⚠️ Attempted to deliver to user ${recipientId}, but socket not found or not open.`);
    }
  }
}

// Start the server
const gateway = new GatewayServer(process.env.PORT || 8080);
gateway.initialize();