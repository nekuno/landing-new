const path = require('path');
const glob = require('glob');
const isDev = (process.env.NODE_ENV !== 'production');

const htmlLoader = {
  loader: 'html-loader',
  options: {
    root: __dirname,
    minimize: !isDev,
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
    name: (isDev ? '[path][name].' : 'assets/[hash:base58:7].') + (ext || "[ext]"),
    publicPath: '/',
  },
});

const cssLoaders = [
  assetFileLoader('css'),
  'extract-loader',
  { loader: 'css-loader', options: { sourceMap: isDev } },
];
if (!isDev) cssLoaders.push('postcss-loader');

module.exports = {
  mode: isDev ? 'development' : 'production',
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
        use: [ ...cssLoaders,
          { loader: 'sass-loader', options: { sourceMap: isDev } }
        ]
      },
      {
        test: /\.css$/i,
        use: cssLoaders
      },
      {
        test: /\.(png|jpg|svg|webp|woff2?|ttf|eot)$/i,
        use: [ assetFileLoader() ]
      },
    ]
  },
  plugins: [],
};
