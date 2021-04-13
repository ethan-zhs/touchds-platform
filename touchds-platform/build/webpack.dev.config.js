const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const base = require('./webpack.base.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TSLintPlugin = require('tslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

// const isProd = process.env.NODE_ENV == 'production';

const config = (type) => merge(base, {
    // devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    entry: {
        dev: [
            'webpack-hot-middleware/client?reload=true',
        ],
        main: [
            path.join(__dirname, '../src/index.tsx'),
        ],
        runtimeIframe: [
            path.join(__dirname, '../runtime/index.editor.tsx'),
        ],
        runtimePreview: [
            path.join(__dirname, '../runtime/index.preview.tsx'),
        ],
        runtimePublish: [
            path.join(__dirname, '../runtime/index.publish.tsx'),
        ],
    },

    output: {
        filename: '[name].js'
    },

    resolve: {
        alias: {
            constants: path.resolve(__dirname, '../node_modules/constants-browserify/constants.json'),
        }
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, '../node_modules/monaco-editor')
                ],
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: {
                            babelrc: true,
                            plugins: ['react-hot-loader/babel'],
                        }
                    },
                ],
                include: [
                    path.join(__dirname, '../src'),
                    path.join(__dirname, '../runtime'),
                    path.join(__dirname, '../node_modules/@itouchtv/react-components-crud'),
                ],
                // exclude: /node_modules/
            },
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: {
                            babelrc: true,
                            plugins: ['react-hot-loader/babel'],
                        }
                    },
                    'awesome-typescript-loader'
                ],
                include: [
                    path.join(__dirname, '../src'),
                    path.join(__dirname, '../runtime'),
                    path.join(__dirname, '../node_modules/@itouchtv/react-components-crud'),
                ],
                // exclude: /node_modules/
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
                            localIdentName: '[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader'
                ],
                include: [
                    path.join(__dirname, '../src'),
                    path.join(__dirname, '../runtime')
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]',
                            }
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ],
                include: [
                    path.join(__dirname, '../src'),
                    path.join(__dirname, '../runtime'),
                    path.join(__dirname, '../node_modules/@itouchtv/react-components-crud'),
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: require('../src/theme/antd_modifyvars.js'),
                            javascriptEnabled: true
                        }
                    }
                ],
                include: path.join(__dirname, '../node_modules/antd/lib')
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|otf|svg|swf)$/,
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
        new webpack.DefinePlugin({
            'process.env.LOCALHOST': `"${process.env.LOCALHOST}"`,
        }),

        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ['json', 'javascript', 'css']
        }),

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
            chunks: ['manifest', 'vendor', 'dev', 'main'],
            hash: true
        }),

        new HtmlWebpackPlugin({
            filename: 'index.editor.html',
            template: path.join(__dirname, '../runtime/index.editor.html'),
            inject: true,  // js插入位置
            chunksSortMode: 'dependency',
            chunks: ['manifest', 'vendor', 'dev', 'runtimeIframe'],
            hash: true
        }),

        new HtmlWebpackPlugin({
            filename: 'index.preview.html',
            template: path.join(__dirname, '../runtime/index.preview.html'),
            inject: true,  // js插入位置
            chunksSortMode: 'dependency',
            chunks: ['manifest', 'vendor', 'dev', 'runtimePreview'],
            hash: true
        }),

        new HtmlWebpackPlugin({
            filename: 'index.publish.html',
            template: path.join(__dirname, '../runtime/index.publish.html'),
            inject: true,  // js插入位置
            chunksSortMode: 'dependency',
            chunks: ['manifest', 'vendor', 'dev', 'runtimePublish'],
            hash: true
        })
    ],


    optimization: {
        minimize: true,
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks:{
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: true,
                    test: /[\\/]node_modules[\\/]/,
                },
            }
        }
    }
});

module.exports = config;
