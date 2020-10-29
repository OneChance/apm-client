const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        publicPath: 'http://apm.ceeg.cn/',
        chunkFilename: '[name].[hash].js'
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 8891,
        disableHostCheck: true,
        compress: true, //启动gzip压缩,加快启动速度
        hot: true //开启HMR，只重新打包修改的模块
    }
});