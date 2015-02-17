'use strict';

angular.module('movietipsApp')
  .controller('FriendsCtrl', function ($scope, $http, Auth, User, Facebook) {

  	$scope.friends = [];
	
	Facebook.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
	
	function statusChangeCallback(response) {
	    if (response.status === 'connected') {
	      // Logged into your app and Facebook.
	      var token = response.authResponse.accessToken;
	      getFriends(token);
	    } else if (response.status === 'not_authorized') {
	      // The person is logged into Facebook, but not your app.
	    } else {
	      // The person is not logged into Facebook, so we're not sure if
	      // they are logged into this app or not.
	    }
	}

	function checkLoginState() {
		Facebook.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	function getFriends(token) {
		FB.api('/me/friends',{fields: 'name,picture.type(large).width(50).height(50)', access_token: token},function(response) {
	    	$scope.$apply(function() {
          		angular.forEach(response.data, function(friend){
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
				$scope.friends.push(friend);
			}).
			error(function(data, status, headers, config) {
				console.log("could not find user");
			});
  	}

  	function addRecommendationsToFriend(friend) {
  		return $http.get("/api/recommendations/user/"+friend.user._id).
			success(function(data, status, headers, config) {
				friend.recommendation_count = data.length;
			}).
			error(function(data, status, headers, config) {
				$scope.recommendation_count = 0;
			});
  	}

});