'use strict';

// Configuring the Foods module
angular.module('foods').run(['Menus',
  function (Menus) {
    // Add the foods dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Foods',
      state: 'foods',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'foods', {
      title: 'List Foods',
      state: 'foods.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'foods', {
      title: 'Create Foods',
      state: 'foods.create',
      roles: ['user']
    });
  }
]);
