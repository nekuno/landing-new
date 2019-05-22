const path = require('path');
const glob = require('glob');

const htmlLoader = {
  loader: 'html-loader',
  options: {
    root: __dirname,
    minimize: true,
    attrs: [
      'link:href',
      'script:src',
      'img:src',
      'source:src',
      'source:srcset',
    ]
  }
};

const htmlFileLoader = {
  loader: "file-loader",
  options: {
    context: 'pages',
    name: '[path][name].[ext]',
  },
};

const assetFileLoader = ext => ({
  loader: "file-loader",
  options: {
    name: 'assets/[hash:base58:7].' + (ext || "[ext]"),
    publicPath: '/',
  },
});

module.exports = {
  entry: glob.sync('./pages/**.html'),
  output: {
    filename: 'dummy.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [
          htmlFileLoader,
          "extract-loader",
          htmlLoader,
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          assetFileLoader('css'),
          'extract-loader',
          { loader: 'css-loader' },
          'postcss-loader',
          { loader: 'sass-loader' },
        ]
      },
      {
        test: /\.(png|jpg|svg|webp|woff2?|ttf|eot)$/i,
        use: [
          assetFileLoader(),
        ]
      },
    ]
  },
  plugins: [],
};
