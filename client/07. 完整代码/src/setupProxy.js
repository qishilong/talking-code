const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://127.0.0.1:1000",
      changeOrigin: true,
    }),
    createProxyMiddleware("/static", {
      target: "http://127.0.0.1:1000",
      changeOrigin: true,
    }),
    createProxyMiddleware("/res", {
      target: "http://127.0.0.1:1000",
      changeOrigin: true,
    })
  );
};
