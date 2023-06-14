// const isProd = process.env.NODE_ENV == 'production';
// const isProd = window ? window.location.href.indexOf('localhost') == -1 : false;
let isProd = false;
try {
  isProd = window.location.host.indexOf('localhost:3000') == -1;
  // console.log(`Config isProd: ${isProd}`, window.location.host);
} catch(e) {}
const dev = require('./dev');
const prod = require('./prod');

module.exports = isProd ? prod : dev;