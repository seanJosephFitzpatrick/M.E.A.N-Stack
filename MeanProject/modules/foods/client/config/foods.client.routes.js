'use strict';

// Setting up route
angular.module('foods').config(['$stateProvider',
  function ($stateProvider) {
    // Foods state routing
    $stateProvider
      .state('foods', {
        abstract: true,
        url: '/foods',
        template: '<ui-view/>'
      })
      .state('foods.list', {
        url: '',
        templateUrl: 'modules/foods/client/views/list-foods.client.view.html'
      })
       .state('foods.change', {
        url: '/foods/change-food-picture',
        templateUrl: 'modules/foods/client/views/change-food-picture.client.view.html'
      })
      .state('foods.create', {
        url: '/create',
        templateUrl: 'modules/foods/client/views/create-food.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('foods.view', {
        url: '/:foodId',
        templateUrl: 'modules/foods/client/views/view-food.client.view.html'
      })
      .state('foods.edit', {
        url: '/:foodId/edit',
        templateUrl: 'modules/foods/client/views/edit-food.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
