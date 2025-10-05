FROM node:18-slim

WORKDIR /app/frontend

# Copy package files first
COPY package*.json ./

# Install dependencies in a single layer to reduce image size
RUN npm install --legacy-peer-deps && \
    npm install --legacy-peer-deps \
    @chakra-ui/react@^2 \
    @emotion/react@^11 \
    @emotion/styled@^11 \
    framer-motion@^6 \
    @babel/plugin-proposal-private-property-in-object \
    @chakra-ui/icons \
    @chakra-ui/system \
    react-router-dom \
    socket.io-client \
    axios \
    react-notification-badge \
    react-scrollable-feed \
    react-lottie \
    leaflet@^1.9.4 \
    react-leaflet@^4.2.1

# Now copy the rest of the application
COPY . .

# Create a directory for node_modules and ensure it exists
RUN mkdir -p node_modules && \
    chmod -R 777 node_modules

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --spider http://localhost:3000 || exit 1 

EXPOSE 3000

# For development, use npm start
CMD ["npm", "start"] 