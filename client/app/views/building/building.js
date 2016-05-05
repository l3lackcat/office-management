'use strict';

angular.module('officeManagementApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/building/:buildingId', {
        templateUrl: 'app/views/building/building.html',
        controller: 'BuildingCtrl',
        authenticate: true
      });
  });
