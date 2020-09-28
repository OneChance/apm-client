const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
    entry: {
        index: path.resolve(__dirname, './app/index.js')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 4
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@vue/babel-preset-jsx'],
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                use: ['url-loader?limit=1&name=images/[hash:8].[name].[ext]']
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?importLoaders=1&minimize=true',
                    'postcss-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?importLoaders=1&minimize=true',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.min.js',
            'svg': 'svg.js/dist/svg.min.js',
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].style.[contenthash:12].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'app/index.html'),
            inject: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery/dist/jquery.min.js',
            $: 'jquery/dist/jquery.min.js'
        }),/*
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dll/manifest.json'),
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, 'dll/vendor.js'),
        })*/
    ]
};