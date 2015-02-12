'use strict';

angular.module('movietipsApp')
	.controller('MainCtrl', function ($scope, $http, Auth, Facebook) {

	$scope.currentUser = Auth.getCurrentUser();
	$scope.recommendations = [];
	$scope.friends = [];

	getRecentRecommendations();

	Facebook.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

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

	function statusChangeCallback(response) {
	    // The response object is returned with a status field that lets the
	    // app know the current login status of the person.
	    // Full docs on the response object can be found in the documentation
	    // for FB.getLoginStatus().
	    if (response.status === 'connected') {
	    	$scope.facebookLoggedIn = true;
	    	// Logged into your app and Facebook.
	    	var token = response.authResponse.accessToken;
	    	getProfilePic(token);
	    	getFriends(token);
	    } else if (response.status === 'not_authorized') {
	    	$scope.facebookLoggedIn = true;
	    } else {
	    	$scope.facebookLoggedIn = false;

	    }
	}

	function getProfilePic(token) {
		Facebook.api('/me', {fields: 'picture.type(large).width(300).height(300)', access_token: token}, function(response) {
			var realProfilePic = response.picture.data.url;
			var standardPic = "http://pbjuhr.se/test/user.jpg";
			if(realProfilePic != $scope.currentUser.profilePic) {
				updateProfilePicture(realProfilePic);
			} else if(!realProfilePic) {
				updateProfilePicture(standardPic);
			}
		});
	}
	
	function updateProfilePicture(newPicture) {
		$http.put("api/users/"+$scope.currentUser._id, {
			profilePic: newPicture
		}).success(function(){
			$scope.currentUser.profilePic = newPicture;
		}).catch(function(err) {
			console.log("profile pic not updated");
		});
	}

	function getFriends(token) {
		FB.api('/me/friends',{fields: 'id', access_token: token},function(response) {
	    	$scope.$apply(function() {
          		$scope.friends = response.data;
          		angular.forEach($scope.friends, function(friend){
          			addUserToFriend(friend);
          		});
            });
		});
  	}

  	function addUserToFriend(friend) {
  		return $http.get("/api/users/friend/"+friend.id).
			success(function(data, status, headers, config) {
				friend.user = data;
				addRecommendationsToFriend(friend);
			}).
			error(function(data, status, headers, config) {
				console.log("could not find user");
			});
  	}

}); 
