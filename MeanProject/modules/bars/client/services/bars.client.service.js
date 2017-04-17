'use strict';

//Bars service used for communicating with the bars REST endpoints
angular.module('bars').factory('Bars', ['$resource',
  function ($resource) {
    return $resource('api/bars/:barId', {
      barId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
