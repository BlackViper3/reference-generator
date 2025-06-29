const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = (app) => {
    app.use(
        '/api/autocite',
        createProxyMiddleware({
            target: 'https://www.mybib.com',
            changeOrigin: true,
            pathRewrite: { '^/api/autocite': '/api/autocite' },
        })
    );
};