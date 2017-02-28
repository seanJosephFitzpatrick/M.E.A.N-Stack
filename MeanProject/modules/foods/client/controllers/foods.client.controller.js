'use strict';

// Foods controller
angular.module('foods').controller('FoodsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Foods', 'Upload', 
'$timeout',
  function ($scope, $stateParams, $location, Authentication, Foods, Upload, $timeout) {
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
                $scope.foodImageURL = response.data.uploadedURL;
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

      
    // Create new Food
    $scope.create = function () {
      // Create new Food object
      var food = new Foods({
        title: this.title,
        foodImageURL: $scope.foodImageURL,
        time: this.time,
        place: this.place,
        address: this.address,
        performers: this.performers,
        short_bio: this.short_bio,
        description: this.description
      });

      // Redirect after save
      food.$save(function (response) {
        $location.path('foods/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.foodImageURL = '';
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

    // Remove existing Food
    $scope.remove = function (food) {
      if (food) {
        food.$remove();

        for (var i in $scope.foods) {
          if ($scope.foods[i] === food) {
            $scope.foods.splice(i, 1);
          }
        }
      } else {
        $scope.food.$remove(function () {
          $location.path('foods');
        });
      }
    };

    // Update existing Food
    $scope.update = function () {
      var food = $scope.food;
      food.foodImageURL = $scope.foodImageURL;

      food.$update(function () {
        $location.path('foods/' + food._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Foods
    $scope.find = function () {
      $scope.foods = Foods.query();
    };

    // Find existing Food
    $scope.findOne = function () {
      $scope.food = Foods.get({
        foodId: $stateParams.foodId
      });
    };
  }
]);
