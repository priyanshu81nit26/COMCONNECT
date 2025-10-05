FROM node:18-slim

# Install wget and ping tools
RUN apt-get update && apt-get install -y wget iputils-ping && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy package files first
COPY backend/package*.json ./

# Install ALL dependencies in a single layer
RUN npm install --include=dev && \
    npm install -g nodemon && \
    npm install \
    express-async-handler \
    express \
    mongoose \
    dotenv \
    jsonwebtoken \
    bcryptjs \
    socket.io \
    cors \
    colors \
    firebase-admin \
    kafkajs \
    ioredis \
    tls

# Now copy the backend files only
COPY backend/ .

# Create a directory for node_modules and ensure it exists
RUN mkdir -p node_modules && \
    chmod -R 777 node_modules

EXPOSE 5000

CMD ["npm", "run", "dev"]