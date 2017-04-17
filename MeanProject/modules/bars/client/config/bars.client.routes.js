'use strict';

// Setting up route
angular.module('bars').config(['$stateProvider',
  function ($stateProvider) {
    // Bars state routing
    $stateProvider
      .state('bars', {
        abstract: true,
        url: '/bars',
        template: '<ui-view/>'
      })
      .state('bars.list', {
        url: '',
        templateUrl: 'modules/bars/client/views/list-bars.client.view.html'
      })
       .state('bars.change', {
        url: '/bars/change-bar-picture',
        templateUrl: 'modules/bars/client/views/change-bar-picture.client.view.html'
      })
      .state('bars.create', {
        url: '/create',
        templateUrl: 'modules/bars/client/views/create-bar.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('bars.view', {
        url: '/:barId',
        templateUrl: 'modules/bars/client/views/view-bar.client.view.html'
      })
      .state('bars.edit', {
        url: '/:barId/edit',
        templateUrl: 'modules/bars/client/views/edit-bar.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
