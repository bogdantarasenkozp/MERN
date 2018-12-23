'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('../configs');

const ENV = process.env.NODE_ENV;
const PLATFORMS = [ 'deskpad' ];
const IS_DEBUG = [ 'development', 'local' ].includes(ENV);
const PLUGINS = [
    new webpack.LoaderOptionsPlugin({
        debug: IS_DEBUG,
        minimize: ! IS_DEBUG
    }),
    new webpack.ProvidePlugin({ React: 'react' }),
    new AssetsPlugin({
        path: path.resolve(__dirname, '..', 'build'),
        filename: 'assets.json',
        update: true
    }),
    new ExtractTextPlugin(IS_DEBUG ? 'bundle_[name].css' : 'bundle_[name]_[hash].css'),
    new CopyWebpackPlugin([ { from: 'static', to: 'static' } ]),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '..', 'index.html')
    })
];

const PRODUCTION_PLUGINS = [
    new webpack.optimize.UglifyJsPlugin({ comments: false }),
    new webpack.optimize.AggressiveMergingPlugin()
];

module.exports = PLATFORMS.map(platform => ({
    entry: {
        [platform]: path.resolve(__dirname, '..', platform)
    },

    output: {
        path: path.join(__dirname, '..', 'build'),
        filename: IS_DEBUG ? 'bundle_[name].js' : 'bundle_[name]_[hash].js'
    },

    cache: IS_DEBUG,

    plugins: PLUGINS.concat([
        new webpack.DefinePlugin({
            IS_DEBUG: JSON.stringify(IS_DEBUG),
            'process.env': JSON.stringify(process.env),
            'process.env.NODE_ENV': JSON.stringify(IS_DEBUG ? ENV : 'production')
        })
    ]).concat(IS_DEBUG ? [] : PRODUCTION_PLUGINS),

    devtool: IS_DEBUG ? 'inline-source-map' : '',

    devServer: {
        contentBase: './build',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        },
        proxy: {
            '/api': {
                target: config.api,
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: '',
                onProxyReq(request) {
                    request.setHeader('origin', config.api);
                },
                bypass(req) {
                    if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
                        console.log('kipping proxy for browser request.');

                        return 'index.html';
                    }
                }
            }
        }
    },

    resolve: {
        modules: [
            path.resolve(__dirname, '..'),
            path.resolve(__dirname, '..', 'node_modules')
        ],
        plugins: [
            new DirectoryNamedWebpackPlugin(true)
        ],
        symlinks: false
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: IS_DEBUG,
                        babelrc: false,
                        presets: [
                            [ '@babel/env', {
                                useBuiltIns: 'entry',
                                targets: [ '> 5%', 'ie 9' ],
                                modules: 'commonjs'
                            } ],
                            '@babel/react'
                        ],
                        plugins: [
                            '@babel/transform-object-assign',
                            '@babel/proposal-class-properties',
                            [ '@babel/proposal-object-rest-spread', { useBuiltIns: true } ]
                        ],
                        env: {
                            production: {
                                plugins: [
                                    'transform-react-remove-prop-types',
                                    '@babel/transform-react-inline-elements',
                                    '@babel/transform-react-constant-elements'
                                ]
                            }
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                minimize: ! IS_DEBUG,
                                sourceMap: IS_DEBUG
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }
            }
        ]
    }
}));
