'use strict';

// Restaurants controller
angular.module('restaurants').controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Restaurants', 'Upload', 
'$timeout',
  function ($scope, $stateParams, $location, Authentication, Restaurants, Upload, $timeout) {
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
                $scope.restaurantImageURL = response.data.uploadedURL;
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

      
    // Create new Restaurant
    $scope.create = function () {
      // Create new Restaurant object
      var restaurant = new Restaurants({
        title: this.title,
        restaurantImageURL: $scope.restaurantImageURL,
        time: this.time,
        place: this.place,
        address: this.address,
        performers: this.performers,
        short_bio: this.short_bio,
        description: this.description
      });

      // Redirect after save
      restaurant.$save(function (response) {
        $location.path('restaurants/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.restaurantImageURL = '';
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

    // Remove existing Restaurant
    $scope.remove = function (restaurant) {
      if (restaurant) {
        restaurant.$remove();

        for (var i in $scope.restaurants) {
          if ($scope.restaurants[i] === restaurant) {
            $scope.restaurants.splice(i, 1);
          }
        }
      } else {
        $scope.restaurant.$remove(function () {
          $location.path('restaurants');
        });
      }
    };

    // Update existing Restaurant
    $scope.update = function () {
      var restaurant = $scope.restaurant;
      restaurant.restaurantImageURL = $scope.restaurantImageURL;

      restaurant.$update(function () {
        $location.path('restaurants/' + restaurant._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Restaurants
    $scope.find = function () {
      $scope.restaurants = Restaurants.query();
    };

    // Find existing Restaurant
    $scope.findOne = function () {
      $scope.restaurant = Restaurants.get({
        restaurantId: $stateParams.restaurantId
      });
    };
  }
]);
