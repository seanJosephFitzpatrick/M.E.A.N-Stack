'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
	
	$scope.events = [
		{
			img: 'glyphicon-eye-open',
			color: 'btn-primary',
			title: 'Search Events',
			description: 'description'
		},
		{
			img: 'glyphicon-eye-open',
			color: 'btn-primary',
			title: 'Search Events',
			description: 'description'
		},
		{
			img: 'glyphicon-calendar',
			color: 'btn-info',
			title: 'Search Events',
			description: 'description'
		},
		{
			img: 'glyphicon-eye-open',
			color: 'btn-primary',
			title: 'Search Events',
			description: 'description'
		},
		{
			img: 'glyphicon-user',
			color: 'btn-danger',
			title: 'Search Events',
			description: 'description'
		},
		{
			img: 'glyphicon-eye-open',
			color: 'btn-warning',
			title: 'Search Events',
			description: 'description'
		}
	];
	
	
  }
]);
