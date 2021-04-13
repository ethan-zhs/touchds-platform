const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const path = require('path')

const config = require('../config/webpack.dev.config.js')
const options = {
    contentBase: [path.join(__dirname, '..', 'dist'), path.join(__dirname, '..', 'coms-examples')],
    hot: true,
    host: '0.0.0.0',
    compress: true,
    historyApiFallback: true // 访问任何地址都转向index.html
}

webpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new webpackDevServer(compiler, options)

server.listen(5000, 'localhost', () => {
    console.log('Http server is running on: http://localhost:', 5000)
})
