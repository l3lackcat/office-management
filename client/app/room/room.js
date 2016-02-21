'use strict';

angular.module('officeManagementApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/room/:roomId', {
        templateUrl: 'app/room/room.html',
        controller: 'RoomCtrl',
        authenticate: true
      });
  });
