'use strict';

angular.module('movietipsApp')
	.controller('LoginCtrl', function ($scope, $window, Auth) {

	$scope.loginOauth = function(provider) {
    	$window.location.href = '/auth/' + provider;
    };

});
