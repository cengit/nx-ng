const PROXY_CONFIG = {
  '/api/v2': {
    target: 'http://10.15.13.33:9090',
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader(
        'cookie',
        'TOKEN=xxxxx',
      );
    },
  },
  '/api': {
    target: 'https://api.xxxx.com/',
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader(
        'cookie',
        'TOKEN=xxxxxxx',
      );
    },
    // pathRewrite: {
    //   '^/api/ng': '',
    // },
  },
};

module.exports = PROXY_CONFIG;
