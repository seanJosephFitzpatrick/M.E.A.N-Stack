'use strict';

//Clubs service used for communicating with the clubs REST endpoints
angular.module('clubs').factory('Clubs', ['$resource',
  function ($resource) {
    return $resource('api/clubs/:clubId', {
      clubId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
