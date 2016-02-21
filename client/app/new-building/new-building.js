'use strict';

angular.module('officeManagementApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/new-building', {
        templateUrl: 'app/new-building/new-building.html',
        controller: 'NewBuildingCtrl',
        authenticate: true
      });
  });
