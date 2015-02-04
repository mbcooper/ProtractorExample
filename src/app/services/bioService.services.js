/**
 * Created by mike on 2/4/2015.
 */
angular.module('sampleProtractor.services.bio', [
  'sampleProtractor.models.bio'
])
  .service('bioService', function($http, $q, Bio) {
    'use strict';

    /**
     * @class bioService
     *
     **/

    var url = 'https://www.biocatalogue.org/search.json?q=';

    var search = function() {
      var defer = $q.defer();

      $http(
        {
          method: 'GET',
          url: url,
          isArray: true,
          cache: false
        }
      )
        .success(function(responses) {
          var bios = [];
          _.each(responses, function(dto) {
            var bio = new Bio();
            bio.fromDTO(dto);
            bios.push(bio);
          });
          defer.resolve(bios);
        })
        .error(function(data, status, headers, config) {

          defer.reject(data);
        });

      return defer.promise;
    };

    return {
      search: search
    };
  });
