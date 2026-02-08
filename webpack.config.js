const path = require('path');

const baseConfig = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    mode: 'production',
};

module.exports = [
    // UMD Build
    {
        ...baseConfig,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.umd.js',
            library: {
                name: 'HashtagCms',
                type: 'umd',
            },
            globalObject: 'this',
        },
    },
    // CommonJS Build
    {
        ...baseConfig,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            library: {
                type: 'commonjs',
            },
        },
        externals: ['axios'], // Don't bundle axios in CJS
    },
    // ESM Build
    {
        ...baseConfig,
        experiments: {
            outputModule: true,
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.esm.js',
            library: {
                type: 'module',
            },
        },
        externals: ['axios'], // Don't bundle axios in ESM
    },
];
