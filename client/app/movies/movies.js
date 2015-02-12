'use strict';

angular.module('movietipsApp')
	.config(function ($stateProvider) {
    	$stateProvider
      	.state('id', {
        	url: '/movies/id/:movieId',
        	templateUrl: 'app/movies/id/id.html',
        	controller: 'IdCtrl'
      	})
		.state('top', {
			url: '/movies/top',
			templateUrl: 'app/movies/top/top.html',
			controller: 'TopCtrl'
		});
 	});
