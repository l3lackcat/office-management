'use strict';

angular.module('officeManagementApp')
  .controller('NewBuildingCtrl', function ($http, $location, $scope) {
    $scope.save = save;
    $scope.cancel = cancel;

    function save () {
      var buildingId = $scope['building']['_id'];

      $http.post('/api/buildings', $scope['building']).success(function (newBuilding) {
        $location.path('/building/' + newBuilding._id);
      });
    };

    function cancel () {
      $scope['editingBuilding'] = null;
      $scope['editingProperty'] = '';
    };
  });
