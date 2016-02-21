'use strict';

angular.module('officeManagementApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/new-room/:buildingId', {
        templateUrl: 'app/new-room/new-room.html',
        controller: 'NewRoomCtrl',
        authenticate: true
      });
  });
