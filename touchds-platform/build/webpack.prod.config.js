const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const base = require('./webpack.base.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TSLintPlugin = require('tslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';

const config = (type) => merge(base, {
    // devtool: 'inline-source-map',
    mode: 'development',
    entry: {
        main: ['webpack-hot-middleware/client?reload=true', '@babel/polyfill', path.join(__dirname, '../src/index.tsx')]
    },

    output: {
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                use: {
                    loader: 'babel-loader?cacheDirectory=true'
                },
                include: path.join(__dirname, '../src'),
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {   
                            importLoaders: 1,    
                            modules: true,
                            localIdentName: '[name]__[local]-[hash:base64:5]'
                        }
                    },
                    'postcss-loader'
                ],
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
                include: path.join(__dirname, '../node_modules/swiper/dist/css')
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]-[hash:base64:5]',
                            importLoaders: 1
                        }
                    },                        
                    'less-loader',
                    'postcss-loader'
                ],
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|svg|swf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4000,
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    performance: {
        maxEntrypointSize: 300000,
        hints: false
    },

    plugins: [
        new LodashModuleReplacementPlugin(), 
        // new BundleAnalyzerPlugin(),
        // webpack热更新组件
        new webpack.HotModuleReplacementPlugin(),

        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        }),

        new TSLintPlugin({
            files: ['./src/**/*.ts', './src/**/*.tsx']
        }),

        new webpack.DllReferencePlugin({ 
            manifest: require('../dll/vendor-manifest.json')
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '../src/index.html'),   // 模板路径
            inject: true,  // js插入位置
            chunksSortMode: 'dependency',
            chunks: ['manifest', 'vendor', path.join(__dirname, '../src/index.js')],
            hash: true
        }) 
    ],

    optimization: {
        usedExports: true,
        minimize: true,
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "commons",
                    chunks: "all",
                    minSize: 1,
                    priority: 0
                },
                // 首先: 打包node_modules中的文件
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10
                }
            }
        }
    }    
});

module.exports = config;
