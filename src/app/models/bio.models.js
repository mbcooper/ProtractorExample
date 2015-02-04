/**
 * Created by mike on 2/4/2015.
 */
angular.module('sampleProtractor.models.bio', [])
  .factory('Bio', function() {
    'use strict';

    /**
     * @class Bio
     * @constructor
     */
    var Bio = function() {
      this.name = '';

      // affiliation or description
      this.description = '';
      this.submitter = '';

      // joined or created at
      this.createdAt = null;

    };

    /*
     * @method fromDTO
     * @param {object} dto
     */
    Bio.prototype.fromDTO = function(dto) {
      this.name = dto.name;
      this.description = (dto.description) ?
        dto.description : dto.affiliation;
      this.submitter = (dto.submitter) ?
        dto.submitter : '';

      /* jscs: disable */
      this.createdAt = (dto.created_at) ?
        new Date(dto.created_at) :
        new Date(dto.joined);
      /* jscs: enable */
    };

    return Bio;
  });
