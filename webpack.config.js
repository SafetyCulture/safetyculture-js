var 

module.exports = {
    entry  : './lib/safetyculture.js',
    output : {
        path     : 'dist/',
        filename : 'safetyculture.dist.js'
    },
    module : {
        loaders: [ {
                test   : /.js$/,
                loader : 'babel-loader'
            }
        ]
    }
};
