/**
 * Created by mike on 2/4/2015.
 */
module.exports = {

  /**
   * target directory
   */
  buildDirectory: 'build',
  connectPort: 3444,

  appFiles: {
    js: [
      'src/**/*.js'
    ],
    appTemplates: ['src/app/**/*.tpl.html'],
    html: 'src/index.html',
    less: 'src/less/main.less',
    allLess: 'src/less/**/*.less',
    assets: ['src/assets/**']
  },
  /** vendor inclusions
   *
   */
  vendorFiles: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'vendor/angular-animate/angular-animate.min.js',
      'vendor/angular-sanitize/angular-sanitize.min.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/angular-messages/angular-messages.min.js',
      'vendor/lodash/dist/lodash.min.js'
    ],
    css: [
      'vendor/bootstrap/dist/css/bootstrap.min.css',
      'vendor/font-awesome/font-awesome.css'
    ],
    fonts: [
      'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
      'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
      'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
      'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
      'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
      'vendor/font-awesome/fonts/FontAwesome.otf',
      'vendor/font-awesome/fonts/fontawesome-webfont.eot',
      'vendor/font-awesome/fonts/fontawesome-webfont.svg',
      'vendor/font-awesome/fonts/fontawesome-webfont.ttf',
      'vendor/font-awesome/fonts/fontawesome-webfont.woff'
    ],
    assets: []
  }

};
