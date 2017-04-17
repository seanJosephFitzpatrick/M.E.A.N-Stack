'use strict';

// Configuring the Bars module
angular.module('bars').run(['Menus',
  function (Menus) {
    // Add the bars dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Bars',
      state: 'bars',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'bars', {
      title: 'List Bars',
      state: 'bars.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'bars', {
      title: 'Create Bars',
      state: 'bars.create',
      roles: ['user']
    });
  }
]);
