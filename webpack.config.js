const path = require('path');

const htmlLoader = {
  loader: 'html-loader',
  options: {
    root: '.',
    attrs: [
      'link:href',
      'script:src',
      'img:src',
      'source:src',
      'source:srcset',
    ]
  }
};

const assetFileLoader = ext => ({
  loader: "file-loader",
  options: {
    name: '[path][name].' + (ext || "[ext]"),
    length: 12,
  },
});

module.exports = {
  entry: './index.html',
  output: {
    filename: 'dummy.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [
          { loader: "file-loader", options: { name: '[path][name].[ext]' } },
          "extract-loader",
          htmlLoader,
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          assetFileLoader('css'),
          'extract-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]
      },
      {
        test: /\.css$/i,
        use: [
          assetFileLoader(),
          'extract-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
        ]
      },
      {
        test: /\.(png|jpg|svg|webp)$/i,
        use: [
          assetFileLoader(),
        ]
      },
    ]
  },
  plugins: [],
};
