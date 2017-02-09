'use strict';

// Setting up route
angular.module('events').config(['$stateProvider',
  function ($stateProvider) {
    // Events state routing
    $stateProvider
      .state('events', {
        abstract: true,
        url: '/events',
        template: '<ui-view/>'
      })
      .state('events.list', {
        url: '',
        templateUrl: 'modules/events/client/views/list-events.client.view.html'
      })
      .state('events.create', {
        url: '/create',
        templateUrl: 'modules/events/client/views/create-event.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('events.view', {
        url: '/:eventId',
        templateUrl: 'modules/events/client/views/view-event.client.view.html'
      })
      .state('events.edit', {
        url: '/:eventId/edit',
        templateUrl: 'modules/events/client/views/edit-event.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
