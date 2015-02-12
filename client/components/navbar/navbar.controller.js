'use strict';

angular.module('movietipsApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http, $window) {
	
	Auth.isLoggedInAsync(function(result) {
		$scope.isLoggedIn = result;
		$scope.currentUser = Auth.getCurrentUser();
	});
	
	$scope.menu = [{
	  'title': 'Top movies',
	  'icon': 'area-chart',
	  'link': '/movies/top'
	}, {
	  'title': 'Genres',
	  'icon': 'video-camera',
	  'link': '#'
	}];

	$scope.isCollapsed = true;
	
	$scope.selected = undefined;
	$scope.movies = [];

	// Any function returning a promise object can be used to load values asynchronously
	$scope.getMovies = function(searchTerm) {
	    return $http.jsonp('http://api.themoviedb.org/3/search/movie', {
	    	params: { 
	    		api_key: "40f347137c7f515913d4fe89f9f01d24", 
	    		search_type: 'ngram', 
	    		query: searchTerm, 
	    		page: 1, 
	    		callback: 'JSON_CALLBACK' 
	    		}
	    	}).
			success(function(data, status, headers, config) {
				data.results.sort(compare);
				console.log(data.results);
				$scope.movies = data.results;
			}).
			error(function(data, status, headers, config) {
				$scope.movies = [];
			}).then(function() {
				return $scope.movies;
			});
	};

	// Compare function
	function compare(a,b) {
		if (a.popularity < b.popularity)
		     return 1;
		if (a.popularity > b.popularity)
		    return -1;
		return 0;
	}

	/**
		Gets called when user selects a movie
	**/
	$scope.selectMovie = function($item, $model, $label) {
		$location.path("/movies/id/" + $item.id);
	};

	$scope.logout = function() {
    	Auth.logout();
    	$location.path('/login');
    };

	$scope.isActive = function(route) {
	  	return (route == $location.path());
	};

  });