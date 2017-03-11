'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
      var myData = this;
      
    $http.get("https://api.foursquare.com/v2/venues/explore/?near=Dublin&client_id=YZQZP1Q2HEJWMD5ZVBMIQD3VSZC1W4BQCCQTVFEPJWNHL0RK&client_secret=ORHPL2VKKHUTB3KTJVDTB4D20AXBRCFKWVL12EPQNJNDFYBX&v=20131124").success(function(data){
        //console.log(data);
        //var myJson = JSON.stringify(data);
        //console.log(myJson);
        myData.venues = data;
       console.log(data);
    })
	
	$scope.events = [
		{
			img: 'glyphicon-eye-open',
			color: 'btn-primary',
            url: 'events',
            source: 'modules/core/client/img/pic/audience.jpg',
			title: 'Search Events',
			description: 'description'
		},
		{
			img: 'glyphicon-eye-open',
			color: 'btn-primary',
            url: 'restaurants',
            source: 'modules/core/client/img/pic/food.jpg',
			title: 'Search Restaurants',
			description: 'description'
		},
		{
			img: 'glyphicon-calendar',
			color: 'btn-info',
            url: 'clubs',
            source: 'modules/core/client/img/pic/nightlife.jpg',
			title: 'Search Clubs',
			description: 'description'
		},
		{
			img: 'glyphicon-eye-open',
			color: 'btn-primary',
            url: '',
            source: 'modules/core/client/img/pic/hotel.jpg',
			title: 'Search Hotels',
			description: 'description'
		},
		{
			img: 'glyphicon-user',
			color: 'btn-danger',
            url: '',
            source: 'modules/core/client/img/pic/hotel.jpg',
			title: 'Search...... ',
			description: 'description'
		},
		{
			img: 'glyphicon-eye-open',
			color: 'btn-warning',
            url: '',
            source: 'modules/core/client/img/pic/hotel.jpg',
			title: 'Search.....',
			description: 'description'
		}
	];

	
	
  }
]);
