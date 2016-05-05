'use strict';

angular.module('officeManagementApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        authenticate: true
      });
  });
