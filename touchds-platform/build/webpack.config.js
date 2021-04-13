const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config');

const envValue = process.env.NODE_ENV || 'development';

const TYPE ={
    development: devConfig,
    production: prodConfig
};

const exportConfig = TYPE[envValue];

module.exports = exportConfig;
