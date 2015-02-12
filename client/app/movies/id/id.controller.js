'use strict';

angular.module('movietipsApp')
  .controller('IdCtrl', function ($scope, $stateParams, Auth, $http, $location, Facebook) {
  	
  	$scope.currentUrl = $location.absUrl();
  	$scope.isLoggedIn = Auth.isLoggedIn();
	$scope.currentUser = Auth.getCurrentUser();
  	
  	$scope.movie = [];

  	$scope.allRecommendations = [];
  	$scope.friendRecommendations = [];
  	$scope.friends = [];
  	$scope.friendsHasRecommended = false;
  	$scope.hasRecommended = false;    
  	
  	if(!$scope.isLoggedIn) {
  		$scope.hasRecommended = true;
  	}

  	getMovie($stateParams.movieId);
  	getRecommendations($stateParams.movieId);
	
	function getMovie(movieId) {
		$http.jsonp('http://api.themoviedb.org/3/movie/' + movieId, {
	    	params: { 
	    		api_key: "40f347137c7f515913d4fe89f9f01d24", 
	    		callback: 'JSON_CALLBACK' 
	    		}
	    	}).
			success(function(data, status, headers, config) {
				$scope.movieBackground = "http://image.tmdb.org/t/p/w1000" + data.backdrop_path;
    			$scope.moviePoster = "http://image.tmdb.org/t/p/w150" + data.poster_path;
				$scope.movie = data;
			}).
			error(function(data, status, headers, config) {
				console.log("no movie found");
				$location.path("/");
			});
	}

    function getRecommendations(movieId) {
    	$http.get("/api/recommendations/movie/"+movieId).
		success(function(data, status, headers, config) {
			$scope.allRecommendations = data;
			angular.forEach($scope.allRecommendations, function(recommendation, i) {
				// Check for friends in recomendations
				if($scope.hasRecommended === false && $scope.currentUser._id === recommendation.user._id) {
					$scope.friendRecommendations.unshift(recommendation);
					$scope.allRecommendations.splice(i, 1);
					$scope.hasRecommended = true;
				}
			});
			connectFacebook();
		}).
		error(function(data, status, headers, config) {
			console.log("no recommendations");
		});
    }

    function connectFacebook() {
    	Facebook.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				var token = response.authResponse.accessToken;
				getFriends(token);
		    }
		});
    }

    function getFriends(token) {
    	Facebook.api('/me/friends',{fields: 'id', access_token: token},function(response) {
			console.log(response.data.length + " friends");
	    	$scope.friends = response.data;
	    	findFriendRecommendations();
		});
    }

    function findFriendRecommendations() {
    	angular.forEach($scope.allRecommendations, function(recommendation, i) {
			// Check for friends in recomendations
			if(isFriend(recommendation.user.facebook.id)) {
				$scope.friendsHasRecommended = true;
				$scope.friendRecommendations.push(recommendation);
				$scope.allRecommendations.splice(i, 1);
			}
		});
    }

	function isFriend(facebookId) {
	    var i = 0;
	    var nrOfFriends = $scope.friends.length;
	    for(i = 0; i < nrOfFriends; i++) {
	        if ($scope.friends[i].id == facebookId) {
	        	return true;
	        }
	    }
	    return false;
	}

	$scope.recommend = function() {
		if(!$scope.currentUser) {
			console.log("no currentUser");
			return; 
		}
		$http.post("/api/recommendations/", {
			user: $scope.currentUser._id,
			movie: $scope.movie.id
		}).success(function(data, status, headers, config) {
			console.log(data);
			data.user = [];
			data.user._id = $scope.currentUser._id;
			data.user.profilePic = $scope.currentUser.profilePic;
			data.user.name = $scope.currentUser.name;
			$scope.friendRecommendations.unshift(data);
			$scope.hasRecommended = true;
			console.log(data);
		}).error(function(data, status, headers, config) {
			console.log("could not recommend");
		});
	};

});
