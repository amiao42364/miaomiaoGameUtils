// vue.config.js
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/',
    devServer: {
        port: 9099
    },
    productionSourceMap: false,
    configureWebpack: {
        externals: {

        },
        plugins: [
            new BundleAnalyzerPlugin()
        ]
    }
};