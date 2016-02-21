'use strict';

angular.module('officeManagementApp')
  .controller('BuildingCtrl', function ($http, $routeParams, $scope) {
    $scope['building'] = getBuilding($routeParams.buildingId);
    $scope['roomList'] = getRoomList($routeParams.buildingId);
    $scope['editingBuilding'] = null;
    $scope['editingProperty'] = '';

    $scope.saveEditing = saveEditing;
    $scope.startEditing = startEditing;
    $scope.stopEditing = stopEditing;

    function getBuilding (buildingId) {
      $http.get('/api/buildings/' + buildingId).success(function (building) {
        $scope['building'] = building;

        console.log($scope['building']);
      });
    };

    function getRoomList (buildingId) {
      $http.get('/api/rooms/findAllByBuildingId/' + buildingId).success(function (roomList) {
        $scope['roomList'] = roomList;

        console.log($scope['roomList']);
      });
    };

    function saveEditing () {
      var buildingId = $scope['building']['_id'];

      $http.put('/api/buildings/' + buildingId, $scope['editingBuilding']).success(function (newBuilding) {
        $scope['building'] = angular.copy(newBuilding);
        $scope['editingBuilding'] = null;
        $scope['editingProperty'] = '';

        console.log($scope['building']);
      });
    };

    function startEditing (propertyName) {
      $scope['editingBuilding'] = angular.copy($scope['building']);
      $scope['editingProperty'] = propertyName;
    };

    function stopEditing () {
      $scope['editingBuilding'] = null;
      $scope['editingProperty'] = '';
    };
  });
