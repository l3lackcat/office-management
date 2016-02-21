'use strict';

angular.module('officeManagementApp')
  .controller('NewRoomCtrl', function ($http, $location, $routeParams, $scope) {
  	$scope['buildingId'] = $routeParams.buildingId
  	$scope['buildingList'] = getBuildingList();

    $scope.save = save;
    $scope.cancel = cancel;

    function getBuildingList () {
      $http.get('/api/buildings').success(function(buildingList) {
        $scope['buildingList'] = buildingList;
      });
    };

    function save () {
    	$scope['room']['building'] = $scope['buildingId'];

      $http.post('/api/rooms', $scope['room']).success(function (newRoom) {
        $location.path('/building/' + newRoom.building);
      });
    };

    function cancel () {
      $location.path('/building/' + $scope['buildingId']);
    };
  });
