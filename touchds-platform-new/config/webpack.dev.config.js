const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const resolve = (...arg) => path.join(__dirname, '..', ...arg)

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    entry: resolve('src/index.tsx'),
    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    }
                ],
                exclude: /node_modules/,
                include: resolve('src')
            },
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    'ts-loader'
                ],
                exclude: /node_modules/,
                include: resolve('src')
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    'postcss-loader'
                ],
                include: resolve('src')
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ],
                include: resolve('src')
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
                            lessOptions: {
                                modifyVars: {
                                    'primary-color': '#c7990f'
                                },
                                javascriptEnabled: true
                            }
                        }
                    }
                ],
                include: resolve('node_modules/antd')
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|otf|svg|swf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 4000,
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ],
                include: resolve('src')
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@src': resolve('src'),
            '@pages': resolve('src/pages'),
            '@components': resolve('src/components'),
            '@utils': resolve('src/utils')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        // webpack热更新组件
        new webpack.HotModuleReplacementPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('src/index.html'), // 模板路径
            inject: true, // js插入位置
            chunksSortMode: 'none',
            chunks: ['manifest', 'vendor', path.join(__dirname, '../src/index.js')],
            hash: true
        })
    ]
}
