const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.min.js',
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'public', to: 'sketch-meaxure' }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/i,
                use: [path.resolve('./url-webpack-loader'), 'babel-loader', 'terser-loader'],
            },
            {
                test: /\.css$/i,
                use: [
                    path.resolve('./url-webpack-loader'),
                    'css-loader',
                    'uglifycss-loader',
                ],
            },
            {
                test: /\.html$/i,
                use: [path.resolve('./url-webpack-loader'), 'html-loader'],
            }
        ],
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
