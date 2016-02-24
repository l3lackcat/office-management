'use strict';

angular.module('officeManagementApp')
  .controller('NewBuildingCtrl', function ($http, $location, $scope) {
    function save () {
      $http.post('/api/buildings', $scope.building).success(function (newBuilding) {
        $location.path('/building/' + newBuilding._id);
      });
    }

    function cancel () {
      $scope.editingBuilding = null;
      $scope.editingProperty = '';
    }

    $scope.save = save;
    $scope.cancel = cancel;
  });
