const path = require('path');
const webpack = require('webpack');
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';

module.exports = {
    mode: process.env.NODE_ENV,
    node: {
        constants: false,
        fs: 'empty'
    },
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[hash:8].js',
        // chunkFilename: 'js/chunks/[name][hash:8].js',
        sourceMapFilename: 'sourceMaps/[name][hash:8].map'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
        alias: {
            '@src': path.resolve(__dirname, '../src'),
            '@public': path.resolve(__dirname, '../src/statics'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@pages': path.resolve(__dirname, '../src/pages'),
            '@global': path.resolve(__dirname, '../src/global'),
            '@utils': path.resolve(__dirname, '../src/utils'),
            '@hoc': path.resolve(__dirname, '../src/hoc'),
            '@service': path.resolve(__dirname, '../src/services')
        }
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: isProd
        ? []
        : [
            // new FriendlyErrorsPlugin()
        ]
};
