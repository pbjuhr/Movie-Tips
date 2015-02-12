'use strict';

angular.module('movietipsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      }).
      state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl',
        authenticate: false
      }).
      state('profile', {
        url: '/profile/:userId',
        templateUrl: 'app/account/profile/profile.html',
        controller: 'ProfileCtrl'
      }).
      state('friends', {
        url: '/friends',
        templateUrl: 'app/account/friends/friends.html',
        controller: 'FriendsCtrl',
        authenticate: true
      });
  });
