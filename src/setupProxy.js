const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware("/search/", {
          target: "https://www.goodreads.com/",
          changeOrigin: true
    }));
    app.use(createProxyMiddleware("/book/", {
        target: "https://www.goodreads.com/",
        changeOrigin: true
  }));
}