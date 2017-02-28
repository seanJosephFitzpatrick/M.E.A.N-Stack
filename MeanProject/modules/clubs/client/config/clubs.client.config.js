'use strict';

// Configuring the Clubs module
angular.module('clubs').run(['Menus',
  function (Menus) {
    // Add the clubs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Clubs',
      state: 'clubs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'clubs', {
      title: 'List Clubs',
      state: 'clubs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'clubs', {
      title: 'Create Clubs',
      state: 'clubs.create',
      roles: ['user']
    });
  }
]);
