'use strict';

var eventsApp = angular.module('events');

// Events controller
eventsApp.controller('EventsController', ['$scope', '$stateParams', 'Authentication', 'Events',
  function ($scope, $stateParams, Authentication, Events) {
      
    this.authentication = Authentication;
      
    // Find a list of Events
    this.events = Events.query();
    
      
  }
]);

//Events Create controller
eventsApp.controller('EventsCreateController', ['$scope', 'Events',
  function ($scope, Events) {
    
      
      
  }
]);

//Events Edit controller
eventsApp.controller('EventsEditController', ['$scope', 'Events',
  function ($scope, Events) {
    
      
      
  }
]);

/*

    // Create new Event
    $scope.create = function () {
      // Create new Event object
      var event = new Events({
        title: this.title,
        time: this.time,
        place: this.place,
        address: this.address,
        performers: this.performers,
        short_bio: this.short_bio,
        description: this.description
      });

      // Redirect after save
      event.$save(function (response) {
        $location.path('events/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.time = '';
          $scope.place = '';
          $scope.address = '';
          $scope.performers = '';
          $scope.short_bio = '';
          $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Event
    $scope.remove = function (event) {
      if (event) {
        event.$remove();

        for (var i in $scope.events) {
          if ($scope.events[i] === event) {
            $scope.events.splice(i, 1);
          }
        }
      } else {
        $scope.event.$remove(function () {
          $location.path('events');
        });
      }
    };

    // Update existing Event
    $scope.update = function () {
      var event = $scope.event;

      event.$update(function () {
        $location.path('events/' + event._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find existing Event
    $scope.findOne = function () {
      $scope.event = Events.get({
        eventId: $stateParams.eventId
      });
    };
    
*/

