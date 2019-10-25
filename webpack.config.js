module.exports = {
  mode : "development",
  module:  {
    rules: [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react']
                }
            }
        }, // ...
    ]
}
}