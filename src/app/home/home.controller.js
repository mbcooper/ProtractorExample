/**
 * Created by mike on 2/4/2015.
 */
angular.module('sampleProtractor.controller.home', [
  'sampleProtractor.services.bio'
])
  .controller('Home', Home)
  .config(function($stateProvider) {
    'use strict';
    $stateProvider.state('home', {
      url: '/home',
      views: {
        'content@': {
          templateUrl: 'home/home.tpl.html',
          controller: 'Home as home'
        }
      }
    });
  }
);

/**
 * @class Home

 * @constructor
 */
function Home(bioService) {
  'use strict';
  this.alert = null;
  this.searchPattern = /^[a-zA-Z0-9]*$/;
  this.isLoading = false;
  this.search = '';

  this.results = [];
  var vm = this;

  /**
   * @method makeSearch - lookup the term
   */
  this.makeSearch = function() {
    vm.isLoading = true;
    vm.alert = null;
    var doSearch = bioService.search(vm.search);

    doSearch.then(
      function(bios) {
        vm.results = bios;
      },
      function(error) {
        vm.alert = 'Error: ' + error;
      }
    );

    doSearch.finally(function() {
      vm.isLoading = false;
    });
  };

}
