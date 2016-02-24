'use strict';

angular.module('officeManagementApp')
  .controller('MainController', function ($scope, $http) {
    function getBuildingList () {
      $http.get('/api/buildings').success(function(buildingList) {
        $scope.buildingList = buildingList;
      });
    }

    function getRoomList () {
      $http.get('/api/rooms').success(function(roomList) {
        $scope.roomList = roomList;
      });
    }
    
    $scope.buildingList = getBuildingList();
    $scope.roomList = getRoomList();
  });

