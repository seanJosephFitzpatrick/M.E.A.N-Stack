'use strict';

var eventsApp = angular.module('events');

// Events controller
eventsApp.controller('EventsController', ['$scope', '$stateParams', 'Authentication', 'Events', '$modal', '$log',
  function ($scope, $stateParams, Authentication, Events, $modal, $log) {
      
    this.authentication = Authentication;
      
    // Find a list of Events
    this.events = Events.query();
      
    //open model window to update event
    this.modalUpdate = function (size, selectedEvent) {
  
    var modalInstance = $modal.open({
      templateUrl: 'modules/events/client/views/edit-event.client.view.html',
      controller: function ($scope, $modalInstance, event) {
          $scope.event = event;
      },
      size: size,
      resolve: {
        event: function () {
          return selectedEvent;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });   
    };   
  }
]);

//Events Create controller
eventsApp.controller('EventsCreateController', ['$scope', 'Events',
  function ($scope, Events) {
    
      
      
  }
]);

//Events Edit controller
eventsApp.controller('EventsUpdateController', ['$scope', 'Events',
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

