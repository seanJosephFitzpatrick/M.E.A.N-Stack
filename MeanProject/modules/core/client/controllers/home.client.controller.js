'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
	
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
