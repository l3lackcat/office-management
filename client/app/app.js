'use strict';

angular.module('officeManagementApp', [
  'officeManagementApp.auth',
  'officeManagementApp.admin',
  'officeManagementApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'validation.match',
  'angularFileUpload'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
