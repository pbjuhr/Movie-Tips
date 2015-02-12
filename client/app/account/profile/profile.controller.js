'use strict';

angular.module('movietipsApp')
	.controller('ProfileCtrl', function ($scope, $stateParams, $http, Auth) {

	var userId = $stateParams.userId;
	$scope.user = [];
	$scope.currentUser = Auth.getCurrentUser();
	$scope.allRecommendations = [];

	if(Auth.getCurrentUser()._id === userId) {
		$scope.user = Auth.getCurrentUser();
	} else {
		$http.get("/api/users/"+userId).
			success(function(data, status, headers, config) {
				console.log(data);
				$scope.user = data;
			}).
			error(function(data, status, headers, config) {
				console.log("could not find user");
			});
	}
	
	$http.get("/api/recommendations/user/"+userId).
		success(function(data, status, headers, config) {
			$scope.allRecommendations = data;
			angular.forEach(data, function(recommendation, i) {
				getMovieData(recommendation);
			});
		}).
		error(function(data, status, headers, config) {
			$scope.allRecommendations = [];
		});

	function getMovieData(recommendation) {
		return $http.jsonp('http://api.themoviedb.org/3/movie/' + recommendation.movie, {
	    	params: { 
	    		api_key: "40f347137c7f515913d4fe89f9f01d24", 
	    		callback: 'JSON_CALLBACK' 
	    		}
	    	}).
			success(function(data, status, headers, config) {
				data.poster_path = "http://image.tmdb.org/t/p/w150" + data.poster_path;
				recommendation.movie = data;
			}).
			error(function(data, status, headers, config) {
				console.log("no movie found");
			});
	}

	$scope.deleteRecommendation = function(recommendation, index) {
		$http.delete("/api/recommendations/"+recommendation._id).
			success(function(data, status, headers, config) {
				console.log("deleted: " + recommendation.movie.title);
				$scope.allRecommendations.splice(index, 1);
			}).
			error(function(data, status, headers, config) {
				console.log("could not remove recommendation");
			});
	}

});
