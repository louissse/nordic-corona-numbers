const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    // 1
    entry: './src/index.js',
    // 2
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    // 3
    devServer: {
      contentBase: './dist'
    },
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              {                // After all CSS loaders we use plugin to do his work.
                // It gets all transformed CSS and extracts it into separate
                // single bundled file
              loader:MiniCssExtractPlugin.loader
              },
              // {
              // // Creates `style` nodes from JS strings
              // loader:'style-loader'
              // },
              {
              // Translates CSS into CommonJS
              loader:'css-loader'
              },
              {

              // Compiles Sass to CSS
              loader: 'sass-loader',
              }


            ],
          },
        ],
      },
      plugins: [

        new MiniCssExtractPlugin({
          filename: "bundle.css"
        })
      
      ]
  };