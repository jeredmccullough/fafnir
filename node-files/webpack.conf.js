import * as conf from './amp.conf';
import path from 'path';
import webpack from 'webpack';
import HappyPack from 'happypack';
import StatsWebpackPlugin from 'stats-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import tmpConfig from './tmp/partner';
import _ from 'lodash';

const partner = process.env.PARTNER;
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDevelopment = process.env.NODE_ENV === 'development';
const startServer = process.env.START_SERVER === 'true' || process.env.START_SERVER === 'open';
const TESTPATH = `./${process.env.TESTPATH || '**/*'}.spec.js`;
const {src, defaultPath} = conf.paths;


/**
* Plugin Configs
*/
const globals = {
  _: 'lodash',
  m: 'mithril',
  $script: 'scriptjs'
};

_.merge(globals, tmpConfig.globals);
const envWhiteList = {'NODE_ENV': false, ENV: false, PARTNER: false};
const entry = {};
partner && _.each(tmpConfig.templates, template => {
  entry[template] = path.resolve(`partners/${partner}/scripts/templates/${template}.js`);
});

/**
 * Env Constants
 */
if (isTest) {
  /*eslint-disable no-console*/
  console.log('*****************************************************');
  console.log('| Test ENV detected: Not loading SCSS PUG or ASSETS');
  console.log(`| Testing ${TESTPATH}`);
  console.log('*****************************************************');
  /*eslint-enable no-console*/
}

/**
 * Webpack Rules
 */
const jsLoaders = [
  {
    test: /modernizr/,
    loader: 'imports-loader?this=>window!exports-loader?window.Modernizr'
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
      isProd ? {
        loader: 'babel-loader', options: {
          plugins: [
            'transform-es2015-template-literals',
            'transform-es2015-literals',
            'transform-es2015-function-name',
            'transform-es2015-arrow-functions',
            'transform-es2015-block-scoped-functions',
            'transform-es2015-classes',
            'transform-es2015-object-super',
            'transform-es2015-shorthand-properties',
            'transform-es2015-computed-properties',
            'transform-es2015-for-of',
            'transform-es2015-sticky-regex',
            'transform-es2015-unicode-regex',
            'check-es2015-constants',
            'transform-es2015-spread',
            'transform-es2015-parameters',
            'transform-es2015-destructuring',
            'transform-es2015-block-scoping',
            'transform-es2015-typeof-symbol',
            ['transform-regenerator', {'async': false, 'asyncGenerators': false}]
          ]
        }
      } : 'happypack/loader',
      'import-glob'
    ]
  }
];

const testLoaders = [
  {
    enforce: 'pre',
    test: /\.js$/,
    // eslint-disable-next-line max-len
    exclude: /\/node_modules\/|\/\.tmp\/|\/sandbox\/|\/cloned-modules\/|\/testing\/|\.run\.js$|\.config\.js$|\.spec\.js$|\.constant\.js$|\.messages\.js$|\-decorator\.js$|\.module\.js$/,
    use: [
      {
        loader: 'istanbul-instrumenter-loader',
        options: {esModules: true}
      },
      'import-glob'
    ]
  },
  {
    test: /tests\.js$/,
    loader: 'string-replace-loader',
    options: {
      search: 'TESTPATH',
      replace: TESTPATH
    },
    enforce: 'pre'
  }
];

isTest && jsLoaders.push(...testLoaders);

const scssLoaderList = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  publicPath: '/',
  use: [
    {
      loader: 'css-loader',
      options: {
        minimize: isProd,
        url: false,
        camelcase: true,
        sourceMap: true
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        includePaths: [
          path.resolve('src'),
          path.resolve('src/styles'),
          path.resolve('src/static/css')
        ]
      }
    }, 'import-glob']
});
const scssLoader = {
  test: /\.scss$/,
  use: scssLoaderList
};

const plugins = [
  new webpack.ProvidePlugin(globals),
  new webpack.EnvironmentPlugin(envWhiteList),
  new HappyPack({loaders: ['babel-loader?presets[]=es2015']}),
  new ExtractTextPlugin({
    filename: `[name].${process.env.HASH}.css`,
    ignoreOrder: true
  })
];

isDevelopment && !startServer && plugins.unshift(
  new StatsWebpackPlugin('stats.json', {chunkModules: true})
);
isProd && plugins.push(new webpack.optimize.UglifyJsPlugin());
const webpackConfig = {
  plugins,
  module: {
    rules: []
    .concat(jsLoaders)
    .concat(scssLoader)
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true,
    profile: isDevelopment
  },

  devtool: isTest ? 'inline-source-map' : 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss'],
    modules: [
      path.resolve(`${src}/scripts`),
      path.resolve(`${src}/scripts/core`),
      path.resolve('node-files'),
      path.resolve('node_modules')
    ]
  },

  output: {
    path: path.resolve(partner ? `partners/${partner}/static/tmp` : defaultPath),
    library: 'amp',
    filename: `[name].${process.env.HASH}.js`
  }
};

!isTest && (webpackConfig.entry = entry);
module.exports = webpackConfig;
