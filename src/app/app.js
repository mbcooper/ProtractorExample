/**
 * Created by mike on 2/4/2015.
 */
angular.module('sampleProtractor', [
  'ngAnimate',
  'ngMessages',
  'ui.router',
  'templates-app',
  'sampleProtractor.controller.home'
])
  .controller('Sample', Sample)
  .config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    $stateProvider.state('default', {
      url: '/',
      abstract: true,
      views: {
        'header': {
          templateUrl: 'layout/header.tpl.html'
        },
        'nav': {
          templateUrl: 'layout/nav.tpl.html'
        },
        'content': {}
      }
    });

    $urlRouterProvider.otherwise('/home');
  }
);

/**
 * @class Controller

 * @constructor
 */
function Sample() {
  'use strict';
  this.welcome = 'Hello';
}
