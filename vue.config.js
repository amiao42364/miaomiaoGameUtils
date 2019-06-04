// vue.config.js
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
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
            new BundleAnalyzerPlugin(),
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, //匹配文件名
                threshold: 10240, //对超过10k的文件压缩
                deleteOriginalAssets: false //是否删除原文件
            })
        ]
    }
};