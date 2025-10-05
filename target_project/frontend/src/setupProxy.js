const { createProxyMiddleware } = require('http-proxy-middleware');
const { API_URL } = require('./config/api.config');

module.exports = function(app) {
  // Only use proxy in development and when not connecting to production
  if (!process.env.REACT_APP_USE_PROD_API) {
    app.use(
      ['/api', '/socket.io'],
      createProxyMiddleware({
        target: API_URL,
        changeOrigin: true,
        ws: true,
      })
    );
  }
};