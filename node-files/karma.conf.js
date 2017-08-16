import path from 'path';
import * as conf from './amp.conf';
import  {default as webpack} from './webpack.conf.js';
import _ from 'lodash';

const srcFiles = {
  other: 'node_modules/babel-polyfill/dist/polyfill.js',
  js: path.join(conf.paths.src, '/tests.js')
};

module.exports = config => {
  const configuration = {
    files: _.flatten(['other', 'js'].map(key => srcFiles[key])),
    singleRun: !process.env.TESTAUTO,
    autoWatch: !!process.env.TESTAUTO,
    logLevel: config.LOG_WARN,
    frameworks: ['jasmine', 'jasmine-matchers'],
    browsers: ['PhantomJS'],
    coverageIstanbulReporter: {
      reports: ['text-summary', 'lcovonly', 'html'],
      dir: conf.paths.docs,
      fixWebpackSourcePaths: true,
      'report-config': {
        subdir: 'html'
      }
    },
    webpack,
    reporters: ['coverage-istanbul', 'mocha'],
    preprocessors: {
      [srcFiles.js]: ['webpack', 'sourcemap']
    }
  };
  config.set(configuration);
};
