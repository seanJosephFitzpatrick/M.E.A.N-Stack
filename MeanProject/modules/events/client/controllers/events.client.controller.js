'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events', 'Upload', 
'$timeout',
  function ($scope, $stateParams, $location, Authentication, Events, Upload, $timeout) {
    $scope.authentication = Authentication;
      
    $scope.uploadFiles = function(file, errFiles) {
        $scope.uploadedFile = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/uploads',
                data: {uploadedFile: file}
            });

            file.upload.then(function (response) {
                console.log('File is successfully uploaded to ' + response.data.uploadedURL);
                $scope.eventImageURL = response.data.uploadedURL;
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        }
    };

      
    // Create new Event
    $scope.create = function () {
      // Create new Event object
      var event = new Events({
        title: this.title,
        eventImageURL: $scope.eventImageURL,
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
        $scope.eventImageURL = '';
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

    // Find a list of Events
    $scope.find = function () {
      $scope.events = Events.query();
    };

    // Find existing Event
    $scope.findOne = function () {
      $scope.event = Events.get({
        eventId: $stateParams.eventId
      });
    };
  }
]);
