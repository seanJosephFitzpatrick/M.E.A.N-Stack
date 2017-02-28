'use strict';

// Setting up route
angular.module('clubs').config(['$stateProvider',
  function ($stateProvider) {
    // Clubs state routing
    $stateProvider
      .state('clubs', {
        abstract: true,
        url: '/clubs',
        template: '<ui-view/>'
      })
      .state('clubs.list', {
        url: '',
        templateUrl: 'modules/clubs/client/views/list-clubs.client.view.html'
      })
       .state('clubs.change', {
        url: '/clubs/change-club-picture',
        templateUrl: 'modules/clubs/client/views/change-club-picture.client.view.html'
      })
      .state('clubs.create', {
        url: '/create',
        templateUrl: 'modules/clubs/client/views/create-club.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('clubs.view', {
        url: '/:clubId',
        templateUrl: 'modules/clubs/client/views/view-club.client.view.html'
      })
      .state('clubs.edit', {
        url: '/:clubId/edit',
        templateUrl: 'modules/clubs/client/views/edit-club.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
