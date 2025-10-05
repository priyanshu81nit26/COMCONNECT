import { API_URL } from "../config/api.config";

const SOCKET_URL = API_URL.replace('/api', '');

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: false
});

// Handle offline/online events
window.addEventListener('online', () => {
  socket.connect();
});

window.addEventListener('offline', () => {
  socket.disconnect();
});

// Reconnect logic for mobile background state
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    socket.connect();
  }
}); 