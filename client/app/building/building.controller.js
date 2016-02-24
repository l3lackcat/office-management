'use strict';

angular.module('officeManagementApp')
  .controller('BuildingCtrl', function ($http, $routeParams, $scope) {
    function getBuilding (buildingId) {
      $http.get('/api/buildings/' + buildingId).success(function (building) {
        $scope.building = building;
      });
    }

    function getRoomList (buildingId) {
      $http.get('/api/rooms/findAllByBuildingId/' + buildingId).success(function (roomList) {
        $scope.roomList = roomList;
      });
    }

    $scope.saveEditing = function () {
      var buildingId = $scope.building._id;

      $http.put('/api/buildings/' + buildingId, $scope.editingBuilding).success(function (newBuilding) {
        $scope.building = angular.copy(newBuilding);
        $scope.editingBuilding = null;
        $scope.editingProperty = '';

        console.log($scope.building);
      });
    };

    $scope.startEditing = function (propertyName) {
      $scope.editingBuilding = angular.copy($scope.building);
      $scope.editingProperty = propertyName;
    };

    $scope.stopEditing = function () {
      $scope.editingBuilding = null;
      $scope.editingProperty = '';
    };

    $scope.building = getBuilding($routeParams.buildingId);
    $scope.roomList = getRoomList($routeParams.buildingId);
    $scope.editingBuilding = null;
    $scope.editingProperty = '';
  });
