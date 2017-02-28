'use strict';

// Configuring the Restaurants module
angular.module('restaurants').run(['Menus',
  function (Menus) {
    // Add the restaurants dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Restaurants',
      state: 'restaurants',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'restaurants', {
      title: 'List Restaurants',
      state: 'restaurants.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'restaurants', {
      title: 'Create Restaurants',
      state: 'restaurants.create',
      roles: ['user']
    });
  }
]);
