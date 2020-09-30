const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BabiliPlugin = require("babili-webpack-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash].js',
        publicPath: 'http://gcsj.yzu.edu.cn/',   //gcsj.yzu.edu.cn
        chunkFilename: 'js/[name].[chunkhash].js'
    },
    optimization: {
        minimizer: [
            new BabiliPlugin(), //js压缩
            new OptimizeCSSPlugin({}) //css压缩
        ],
        runtimeChunk: {
            name: 'manifest'  //将webpack运行时代码独立打包
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                plugin: {
                    test: /[\\/]plugin[\\/]/, //缓存组设置将plugin目录下的文件独立打包
                    priority: 0,
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']), //build前清空dist目录
        new webpack.HashedModuleIdsPlugin(), //防止因为module应为解析顺序变化导致hash id变化
        new ImageminPlugin({
            plugins: [
                ImageminMozjpeg({
                    quality: 80,
                    progressive: true
                })
            ]
        }),
    ]
});