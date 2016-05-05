'use strict';

angular.module('officeManagementApp')
    .controller('BuildingUnitModalCtrl', function ($scope, $uibModalInstance, buildingUnit) {
        $scope.buildingUnit = angular.copy(buildingUnit);

        $scope.cancel = cancel;
        $scope.ok = ok;

        function cancel () {
            $uibModalInstance.dismiss('cancel');
        };

        function ok () {
            $uibModalInstance.close($scope.buildingUnit);
        };
    });
