'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Events', 'Upload', 
'$timeout',
  function ($scope, $http, $stateParams, $location, Authentication, Events, Upload, $timeout) {
    $scope.authentication = Authentication;
      //ARTS - 4bf58dd8d48988d1f2931735
      //Music venue - 4bf58dd8d48988d1e5931735
      //Movie - 4bf58dd8d48988d17f941735
      //Arts + ent - 4d4b7104d754a06370d81259
      //College + uni - 4d4b7105d754a06372d81259
      //Nightlife spot - 4d4b7105d754a06376d81259 \\\\
      //Outdoor and recreation - 4d4b7105d754a06377d81259 \\\\\\
      //Beach - 4bf58dd8d48988d1e2941735 \\\\\
      //Shops + services - 4d4b7105d754a06378d81259 \\\\\
      //Food + drink shop - 4bf58dd8d48988d1f9941735
      //Travel + transport - 4d4b7105d754a06379d81259
      //Hotel - 4bf58dd8d48988d1fa931735 \\\\\\
      /*
    $http.get("https://api.foursquare.com/v2/venues/explore/?near=Galway&categoryId=4bf58dd8d48988d1fa931735&client_id=YZQZP1Q2HEJWMD5ZVBMIQD3VSZC1W4BQCCQTVFEPJWNHL0RK&client_secret=ORHPL2VKKHUTB3KTJVDTB4D20AXBRCFKWVL12EPQNJNDFYBX&v=20131124&venuePhotos=1").then(function(result){
    
        $scope.items = result.data.response.groups[0].items;     
    }) */
      
        $http.get("http://api.eventful.com/json/events/search?app_key=DjPHQVFWsH5q7D85&where=53.2707,-9.0568&within=25").then(function(result, res){
        
          res.header("Access-Control-Allow-Origin", "*");

            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            
        //$scope.items = result.data.response.groups[0].items; 
            var i = JSON.stingify(result);
            console.log(i);
    })
      
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
      event.eventImageURL = $scope.eventImageURL;

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
