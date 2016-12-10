const ip = require('ip');
const path = require('path');
const autoprefixer = require('autoprefixer');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const dashboard = new Dashboard();

const join = path.join.bind(path, __dirname, '..');

const sources = ['src', 'demo'].map(dir => join(dir));

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    app: [
      `webpack-dev-server/client?http://${ip.address()}:3000`,
      join('demo/app/index.ts'),
    ],
    sw: [
      join('demo/sw/index.ts'),
    ],
  },
  output: {
    path: join('build/'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.scss'],
  },
  module: {
    preLoaders: [{
      test: /\.ts$/,
      loader: 'tslint',
      include: sources,
    }],
    loaders: [{
      test: /\.ts$/,
      loader: 'ts',
      include: sources,
    }, {
      test: /\.scss/,
      loader: [
        'style',
        'css',
        'postcss',
        'sass?sourceMap',
      ],
    }],
    noParse: [
      // remove "Critical dependency" warning
      require.resolve('localforage/dist/localforage.nopromises.js'),
    ],
  },
  postcss: [autoprefixer],
  tslint: {
    formatter: 'stylish',
  },
  ts: {
    silent: true,
    compilerOptions: {
      declaration: false,
    },
  },
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /node_modules/,
      failOnError: true,
    }),
    new DashboardPlugin(dashboard.setData),
  ],
};
