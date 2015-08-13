/**
 * Created by mike on 2/4/2015.
 */
'use strict';

// libraries

var gulp = require('gulp');
var _ = require('lodash');
var colors = require('colors');
var template = require('gulp-template');
var del = require('del');
var runSequence = require('run-sequence');
var html2js = require('gulp-html2js');
var htmlmin = require('gulp-htmlmin');
var copy = require('gulp-copy');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var less = require('gulp-less');
var merge = require('gulp-merge');
var orderedStream = require('stream-series');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var util = require('gulp-util');
var gls = require('gulp-live-server');

// local references
var config = require('./config/buildConfig.js');
var pkg = require('./package.json');

/**
 * functions
 */
var VENDOR_REGEX = /^vendor\/.*\/([^\/]*)$/;

/**
 * copy flattens vendor directory, so we chop out middle
 * @param {string} rootName
 * @return {string}
 * @example
 * 'vendor/angular/angular.js' to 'vendor/angular.js',
 * 'vendor/lodash/dist/lodash.js' to  'vendor/lodash.js'
 */
var trimOutVendor = function(rootName) {
  var parts = VENDOR_REGEX.exec(rootName);
  return parts[1];
};

/**
 * clean - cleans out build directory
 */
gulp.task('clean', function(cb) {
  del([config.buildDirectory], {}, cb);
});

/**
 * convert less files to css and merges
 * with vendor css files
 * */
gulp.task(
  'lessCss', function(cb) {
    var cssTarget = pkg.name + '-' + pkg.version + '.css';
    return merge(
      gulp.src(config.appFiles.less)
        .pipe(less().on('error', util.log)),
      gulp.src(config.vendorFiles.css)
    )
      .pipe(concat(cssTarget))
      .pipe(gulp.dest(config.buildDirectory + '/assets/css'));
  }
);

/**
 * Compresses templates
 */
gulp.task(
  'html2js-app', function() {
    return gulp.src(config.appFiles.appTemplates)
      .pipe(
      htmlmin(
        {
          collapseBooleanAttributes: false,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: false,
          removeComments: true,
          removeEmptyAttributes: false,
          removeRedundantAttributes: false,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false,
          caseSensitive: true
        }
      )
    )
      .pipe(
      html2js(
        {
          useStrict: true,
          base: 'src/app',
          outputModuleName: 'templates-app'
        }
      )
    )

      .pipe(concat('templates-app.js'))
      .pipe(gulp.dest(config.buildDirectory));
  }
);

/**
 * copy all assets to build directory
 * */
gulp.task(
  'copySupport', function(cb) {
    gulp.src(config.appFiles.assets)
      .pipe(gulp.dest(config.buildDirectory + '/assets'));

    gulp.src(config.vendorFiles.assets)
      .pipe(gulp.dest(config.buildDirectory + '/assets'));

    gulp.src(config.vendorFiles.fonts)
      .pipe(gulp.dest(config.buildDirectory + '/assets/fonts'));

    cb();
  }
);

/**
 * express server setup
 */
gulp.task('serverExpress', function() {
  var server = gls.new('server/index.js');

  function serverNotify(event) {
    server.notify.call(server, event);
  }

  server.start();

  // Restart the server when file changes
  gulp.watch([
    config.buildDirectory + '/**/index*.html',
    config.buildDirectory + '/src/**/*.js',
    config.buildDirectory + '/templates-*.js'
  ], serverNotify);

  gulp.watch([config.buildDirectory + '/**/*.css'], serverNotify);
  gulp.watch([config.buildDirectory + 'assets/images/**/*'], serverNotify);
  gulp.watch(['server/index.js'], function() {
    server.start.call(server);
  });
});

/**
 * copy user js files to build directory
 * */
gulp.task(
  'buildJs-app', function(cb) {
    return gulp.src(config.appFiles.js)
      .pipe(gulp.dest(config.buildDirectory + '/src'));

  }
);

/**
 * copy vendor js files to build directory
 * */
gulp.task(
  'buildJs-vendor', function(cb) {
    return gulp.src(config.vendorFiles.js)
      .pipe(gulp.dest(config.buildDirectory + '/vendor'));

  }
);

/**
 * build index page with injected scripts
 * */
gulp.task(
  'index', function() {
    // create ordered vendor file list to inject
    var files = [];
    _.each(
      config.vendorFiles.js, function(vendor) {
        files.push('vendor/' + trimOutVendor(vendor));
      }
    );

    var target = gulp.src(config.appFiles.html)
      .pipe(template({files: files}));

    var sources = orderedStream(
      gulp.src(
        [config.buildDirectory + '/*.js'],
        {read: false}
      ),
      gulp.src(
        [config.buildDirectory + '/src/**/*.js',
          config.buildDirectory + '/**/*.css'],
        {read: false}
      )
    );

    return target.pipe(
      inject(
        sources,
        {
          ignorePath: '/build/',
          addRootSlash: false
        }
      )
    )
      .pipe(rename(function(path) {
        path.basename = 'index';
      })
    )
      .pipe(gulp.dest(config.buildDirectory));
  }
);

/**
 * Build sequence
 */
gulp.task(
  'build', function(cb) {

    console.log(colors.green.underline('Building ' + pkg.name));
    runSequence(
      'clean',
      ['html2js-app', 'lessCss', 'copySupport'],
      ['buildJs-app', 'buildJs-vendor'],
      'index',
      cb
    );
  }
);

/**
 * waiting message
 */
gulp.task(
  'console-wait', function(cb) {
    console.log(colors.green('Watching ...'));

  }
);

/**
 * sets up simple node connect server with live reload
 */
gulp.task(
  'connect', function() {
    connect.server(
      {
        root: config.buildDirectory,
        port: config.connectPort,
        fallback: config.buildDirectory + '/index.html',
        livereload: true
      }
    );
  }
);

// default task
gulp.task(
  'default', function(cb) {

    runSequence(
      'build',
      ['watch-mode', 'serverExpress'],
      'console-wait',
      cb
    )
  }
);

/**
 * Set up watchers
 * */
gulp.task(
  'watch-mode', function(cb) {

    var jsWatcher = gulp.watch(
      config.appFiles.js,
      ['buildJs-app']
    );
    var lessWatcher = gulp.watch([config.appFiles.allLess], ['lessCss']);

    var htmlAppWatcher = gulp.watch(
      config.appFiles.appTemplates,
      ['html2js-app']
    );

    function changeNotification(event) {
      console.log(
        'File', event.path, 'was', event.type,
        ', running tasks...'
      );
    }

    jsWatcher.on('change', changeNotification);
    lessWatcher.on('change', changeNotification);
    htmlAppWatcher.on('change', changeNotification);

    cb();
  }
);
