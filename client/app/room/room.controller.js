'use strict';

angular.module('officeManagementApp')
  .controller('RoomCtrl', function ($http, $routeParams, $scope) {
    function getRoom (roomId) {
      $http.get('/api/rooms/' + roomId).success(function (room) {
        $scope.room = angular.copy(room);
      });
    }

    $scope.room = getRoom($routeParams.roomId);
    $scope.editingRoom = null;
    $scope.editingProperty = '';

    $scope.saveEditing = function () {
      var roomId = $scope.room._id;

      $http.put('/api/rooms/' + roomId, $scope.editingRoom).success(function (newRoom) {
        $scope.room = angular.copy(newRoom);
        $scope.editingRoom = null;
        $scope.editingProperty = '';
      });
    };

    $scope.startEditing = function (propertyName) {
      $scope.editingRoom = angular.copy($scope.room);
      $scope.editingProperty = propertyName;
    };

    $scope.stopEditing = function () {
      $scope.editingRoom = null;
      $scope.editingProperty = '';
    };
  });
