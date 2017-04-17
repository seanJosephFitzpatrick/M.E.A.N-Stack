'use strict';

// Bars controller
angular.module('bars').controller('BarsController', ['$scope', '$http', '$rootScope', '$stateParams', '$location', 'Authentication', 'Bars', 'Upload', 
'$timeout',
  function ($scope, $http, $rootScope, $stateParams, $location, Authentication, Bars, Upload, $timeout) {
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
                $scope.barImageURL = response.data.uploadedURL;
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

      
    // Create new Bar
    $scope.create = function () {
      // Create new Bar object
        $scope.bar = bar;
      var bar = new Bars({
        name: this.name,
        barImageURL: $scope.barImageURL,
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
      bar.$save(function (response) {
        $location.path('bars/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.barImageURL = '';
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

    // Remove existing Bar
    $scope.remove = function (bar) {
      if (bar) {
        bar.$remove();

        for (var i in $scope.bars) {
          if ($scope.bars[i] === bar) {
            $scope.bars.splice(i, 1);
          }
        }
      } else {
        $scope.bar.$remove(function () {
          $location.path('bars');
        });
      }
    };

    // Update existing Bar
    $scope.update = function () {
      var bar = $scope.bar;
      bar.barImageURL = $scope.barImageURL;

      bar.$update(function () {
        $location.path('bars/' + bar._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
    //Lazy initialize, this is because map loads before data and would be set to 0,0
    $scope.$on('mapInitialized', function(event,map) {
    var marker = map.markers[0];

        $scope.$watch('bar.lat + bar.lon',function(newVal,oldVal){
                if(newVal === oldVal){return;}
                // checks if value has changed 
                map.setCenter({lat:$scope.bar.lat,lng:$scope.bar.lon});
                marker.setPosition({lat:$scope.bar.lat,lng:$scope.bar.lon});
        });
    });
      
    //click on link in list view to navigate to view
    $scope.gotolink= function(event,barId) {
      $location.path('bars/'+ barId);
    };

    // Find a list of Bars in Database
    $scope.find = function () {
      $scope.bars = Bars.query();
    };
      
    var id = $stateParams.barId;
/*
    // Find existing Bar from Foursquare
    var promise = $http.get('https://api.foursquare.com/v2/venues/' + id + '/?client_id=YZQZP1Q2HEJWMD5ZVBMIQD3VSZC1W4BQCCQTVFEPJWNHL0RK&client_secret=ORHPL2VKKHUTB3KTJVDTB4D20AXBRCFKWVL12EPQNJNDFYBX&v=201311242');
    promise.then(
	  function(payload) {
         
	    $scope.bar = payload.data.response.venue;
          var i = JSON.stringify(payload);
          console.log(i);
          
	  });
      */
           
    // Find existing Bar
    $scope.findOne = function () {
      $scope.bar = Bars.get({
        barId: $stateParams.barId
      });
    };
  }
]);
