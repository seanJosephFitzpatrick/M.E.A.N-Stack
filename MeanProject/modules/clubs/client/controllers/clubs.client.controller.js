'use strict';

// Clubs controller
angular.module('clubs').controller('ClubsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clubs', 'Upload', 
'$timeout',
  function ($scope, $stateParams, $location, Authentication, Clubs, Upload, $timeout) {
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
                $scope.clubImageURL = response.data.uploadedURL;
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

      
    // Create new Club
    $scope.create = function () {
      // Create new Club object
      var club = new Clubs({
        title: this.title,
        clubImageURL: $scope.clubImageURL,
        time: this.time,
        place: this.place,
        address: this.address,
        performers: this.performers,
        short_bio: this.short_bio,
        description: this.description
      });

      // Redirect after save
      club.$save(function (response) {
        $location.path('clubs/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.clubImageURL = '';
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

    // Remove existing Club
    $scope.remove = function (club) {
      if (club) {
        club.$remove();

        for (var i in $scope.clubs) {
          if ($scope.clubs[i] === club) {
            $scope.clubs.splice(i, 1);
          }
        }
      } else {
        $scope.club.$remove(function () {
          $location.path('clubs');
        });
      }
    };

    // Update existing Club
    $scope.update = function () {
      var club = $scope.club;
      club.clubImageURL = $scope.clubImageURL;

      club.$update(function () {
        $location.path('clubs/' + club._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Clubs
    $scope.find = function () {
      $scope.clubs = Clubs.query();
    };

    // Find existing Club
    $scope.findOne = function () {
      $scope.club = Clubs.get({
        clubId: $stateParams.clubId
      });
    };
  }
]);
