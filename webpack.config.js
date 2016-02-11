module.exports = {
    entry  : './lib/index.js',
    output : {
        path     : 'dist/',
        filename : 'safetyculture.dist.js'
    },
    module : {
        loaders: [ 
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.json$/, loader: "json"}
        ]
    },
    externals: {
        fs: '{}',
        net: '{}',
        tls: '{}',
        "cls-bluebird": {}
    }
};
