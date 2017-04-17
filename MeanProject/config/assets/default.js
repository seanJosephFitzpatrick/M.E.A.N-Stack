'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
          
          'modules/core/client/css/bootstrap.min.css',
          'modules/core/client/css/font-awesome.min.css',
          'modules/core/client/css/main.css',
          'modules/core/client/css/animate.css',
          'modules/core/client/css/responsive.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/ng-file-upload/ng-file-upload-shim.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'http://maps.google.com/maps/api/js?key=AIzaSyDllo5Gh2kmkNq5D9HD5Qgrg5SyHJHmHPE',
        'public/lib/ngmap/build/scripts/ng-map.min.js',
          
          'modules/core/client/js/jquery.js',
          'modules/core/client/js/bootstrap.min.js',
          'modules/core/client/js/smoothscroll.js',
          'modules/core/client/js/coundown-timer.js',
          'modules/core/client/js/jquery.scrollTo.js',
          'modules/core/client/js/jquery.nav.js',
          'modules/core/client/js/main.js',
          'modules/core/client/js/jquery.parallax.js'  
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
