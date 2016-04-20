'use strict';

angular.module('officeManagementApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/import-building', {
        templateUrl: 'app/views/import-building/import-building.html',
        controller: 'ImportBuildingCtrl'
      });
  });
