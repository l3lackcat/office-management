'use strict';

angular.module('officeManagementApp')
  .controller('RoomCtrl', function ($http, $routeParams, $scope) {
    $scope['room'] = getRoom($routeParams.roomId);
    $scope['editingRoom'] = null;
    $scope['editingProperty'] = '';

    $scope.saveEditing = saveEditing;
    $scope.startEditing = startEditing;
    $scope.stopEditing = stopEditing;

    function getRoom (roomId) {
      $http.get('/api/rooms/' + roomId).success(function (room) {
        $scope['room'] = angular.copy(room);
      });
    };

    function saveEditing () {
      var roomId = $scope['room']['_id'];

      $http.put('/api/rooms/' + roomId, $scope['editingRoom']).success(function (newRoom) {
        $scope['room'] = angular.copy(newRoom);
        $scope['editingRoom'] = null;
        $scope['editingProperty'] = '';
      });
    };

    function startEditing (propertyName) {
      $scope['editingRoom'] = angular.copy($scope['room']);
      $scope['editingProperty'] = propertyName;
    };

    function stopEditing () {
      $scope['editingRoom'] = null;
      $scope['editingProperty'] = '';
    };
  });
