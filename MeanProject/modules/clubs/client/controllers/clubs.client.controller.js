'use strict';

// Clubs controller
angular.module('clubs').controller('ClubsController', ['$scope', '$http', '$rootScope', '$stateParams', '$location', 'Authentication', 'Clubs', 'Upload', 
'$timeout',
  function ($scope, $http, $rootScope, $stateParams, $location, Authentication, Clubs, Upload, $timeout) {
    $scope.authentication = Authentication;
      
      /*
      Category id: 4d4b7105d754a06374d81259 is for food
      https://developer.foursquare.com/categorytree
      */
     /* 
    $http.get("https://api.foursquare.com/v2/venues/explore/?near=Galway&categoryId=4d4b7105d754a06374d81259&client_id=YZQZP1Q2HEJWMD5ZVBMIQD3VSZC1W4BQCCQTVFEPJWNHL0RK&client_secret=ORHPL2VKKHUTB3KTJVDTB4D20AXBRCFKWVL12EPQNJNDFYBX&v=20131124&venuePhotos=1").then(function(result){
    
        $scope.items = result.data.response.groups[0].items; 
        
    })*/
     
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
        $scope.club = club;
      var club = new Clubs({
        name: this.name,
        clubImageURL: $scope.clubImageURL,
        openHours: this.openHours,
        phone: this.phone,
        lat: this.lat,
        lon: this.lon,
        address: this.address,
        city: this.city,
        county: this.county,
        country: this.country,
        url: this.url,
        category: this.category,
        description: this.description
      });

      // Redirect after save
      club.$save(function (response) {
        $location.path('clubs/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.clubImageURL = '';
        $scope.openHours = '';
          $scope.phone = '';
          $scope.lat = 0;
          $scope.lon = 0;
          $scope.address = '';
          $scope.city = '';
          $scope.county = '';
          $scope.country = '';
          $scope.url = '';
          $scope.category = '';
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
    
    //Lazy initialize, this is because map loads before data and would be set to 0,0
    $scope.$on('mapInitialized', function(event,map) {
    var marker = map.markers[0];

        $scope.$watch('club.lat + club.lon',function(newVal,oldVal){
                if(newVal === oldVal){return;}
                // checks if value has changed 
                map.setCenter({lat:$scope.club.lat,lng:$scope.club.lon});
                marker.setPosition({lat:$scope.club.lat,lng:$scope.club.lon});
        });
    });
      
    //click on link in list view to navigate to view
    $scope.gotolink= function(event,clubId) {
      $location.path('clubs/'+ clubId);
    };

    // Find a list of Clubs in Database
    $scope.find = function () {
      $scope.clubs = Clubs.query();
    };
      
    var id = $stateParams.clubId;
/*
    // Find existing Club from Foursquare
    var promise = $http.get('https://api.foursquare.com/v2/venues/' + id + '/?client_id=YZQZP1Q2HEJWMD5ZVBMIQD3VSZC1W4BQCCQTVFEPJWNHL0RK&client_secret=ORHPL2VKKHUTB3KTJVDTB4D20AXBRCFKWVL12EPQNJNDFYBX&v=201311242');
    promise.then(
	  function(payload) {
         
	    $scope.club = payload.data.response.venue;
          var i = JSON.stringify(payload);
          console.log(i);
          
	  });
      */
           
    // Find existing Club
    $scope.findOne = function () {
      $scope.club = Clubs.get({
        clubId: $stateParams.clubId
      });
    };
  }
]);
