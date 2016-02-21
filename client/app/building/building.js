'use strict';

angular.module('officeManagementApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/building/:buildingId', {
        templateUrl: 'app/building/building.html',
        controller: 'BuildingCtrl',
        authenticate: true
      });
  });
