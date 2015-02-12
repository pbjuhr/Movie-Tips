'use strict';

angular.module('movietipsApp')
  .controller('TopCtrl', function ($scope, $stateParams, Auth, $http, $location, Facebook) {
  	
  	$scope.currentUrl = $location.path;
  	$scope.isLoggedIn = Auth.isLoggedIn();
	$scope.currentUser = Auth.getCurrentUser();
	$scope.orderBy = "desc";
	$scope.sortBy = "recommendation_count";
	$scope.ngRepeatOrderBy = "-"+$scope.sortBy;
	
	//Pagination variables
	$scope.itemsPerPage = 20;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.totalItems = 0;
	$scope.pageChanged = function() {
		if($scope.sortBy == "recommendation_count") {
			
		} else {
			getMovies();
		}
		
	};

	getMoviesByRecommendations();
	getRecentRecommendations();

	function getMovies() {
		var minVotes = 400;
		var sortBy = $scope.sortBy+"."+$scope.orderBy;

		if($scope.sortBy == 'vote_count' && $scope.orderBy == 'asc') {
			minVotes = 400;
		} else if($scope.sortBy == 'vote_average' && $scope.orderBy == 'asc') {
			minVotes: 0;
		}

		var params = {
	    	params: { 
	    		"api_key": "40f347137c7f515913d4fe89f9f01d24", 
	    		"include_adult": false, 
	    		"page": $scope.currentPage,
	    		"sort_by": sortBy,
	    		"vote_count.gte": minVotes,
	    		callback: 'JSON_CALLBACK' 
	    		}
	    	};

		$http.jsonp('http://api.themoviedb.org/3/discover/movie', params).
		success(function(data, status, headers, config) {
			$scope.totalItems = data.total_results;
			var movies = data.results;
			angular.forEach(movies, function(movie){
				movie.poster_path = "http://image.tmdb.org/t/p/w150" + movie.poster_path;
				getRecommendationCount(movie);
			});
			$scope.movies = movies;
		}).
		error(function(data, status, headers, config) {
			$scope.movies = [];
		});
	}

	function getRecommendationCount(movie) {
    	return $http.get("/api/recommendations/movie/"+movie.id).
		success(function(data, status, headers, config) {
			var recommendation_count = data.length;
			movie.recommendation_count = recommendation_count;
		}).
		error(function(data, status, headers, config) {
			movie.recommendation_count = 0;
		});
    }

    function getMoviesByRecommendations() {
		$http.get("/api/recommendations/count/count").
			success(function(data, status, headers, config) {
				$scope.movies = [];
				$scope.totalItems = data.length;
				$scope.currentPage = 1;
				angular.forEach(data, function(recommendation){
					recommendation.movie = [];
					addMovie(recommendation._id, recommendation.recommendation_count);
				});
			}).
			catch(function(data, status, headers, config) {
				// No recommendations
			});
	}

	function addMovie(movieId, recommendation_count) {
		$http.jsonp('http://api.themoviedb.org/3/movie/' + movieId, {
	    	params: { 
	    		api_key: "40f347137c7f515913d4fe89f9f01d24", 
	    		callback: 'JSON_CALLBACK' 
	    		}
	    	}).
			success(function(data, status, headers, config) {
				data.poster_path = "http://image.tmdb.org/t/p/w150" + data.poster_path;
				data.recommendation_count = recommendation_count;
				$scope.movies.push(data);
			}).
			error(function(data, status, headers, config) {
				console.log("no movie found");
			});
	}

	function getRecentRecommendations() {
		$http.get("/api/recommendations/").
		success(function(data, status, headers, config) {
			$scope.recentRecommendations = data.splice(0,10);
			angular.forEach($scope.recentRecommendations, function(recommendation){
				getMovieData(recommendation.movie, recommendation);
			});
		}).
		error(function(data, status, headers, config) {
			console.log("no recommendations");
		});
	}

	function getMovieData(movieId, recommendation) {
		return $http.jsonp('http://api.themoviedb.org/3/movie/' + movieId, {
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

	$scope.sort = function(sortBy) {
		// Change sort by
		if(sortBy != $scope.sortBy) {
			$scope.sortBy = sortBy;
			// Toggle orderBy
			if($scope.orderBy == "desc") {
				$scope.ngRepeatOrderBy = "-"+$scope.sortBy;
			} else {
				$scope.ngRepeatOrderBy = $scope.sortBy;
			}
		} else {
			// Toggle orderBy
			if($scope.orderBy == "desc") {
				$scope.orderBy = "asc";
				$scope.ngRepeatOrderBy = $scope.sortBy;
			} else {
				$scope.orderBy = "desc";
				$scope.ngRepeatOrderBy = "-"+$scope.sortBy;
			}
		}
		if(sortBy == "recommendation_count") {
			getMoviesByRecommendations();
		} else {
			getMovies();
		}
	}

});
