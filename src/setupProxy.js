const proxy = require('http-proxy-middleware');

module.exports = (app)=> {
    app.use(proxy('/api/socket', { target: 'ws://' + process.env.REACT_APP_URL_DEV, ws: true }));
    app.use(proxy('/api', { target: 'http://' + process.env.REACT_APP_URL_DEV ,changeOrigin: true,secure:true}));
};
