'use strict';

angular.module('officeManagementApp')
    .controller('CustomRangeModalCtrl', function ($scope, $uibModalInstance) {
        $scope.range = {
            min: null,
            max: null
        };

        $scope.cancel = cancel;
        $scope.ok = ok;

        function cancel () {
            $uibModalInstance.dismiss('cancel');
        };

        function ok () {
            $uibModalInstance.close($scope.range);
        };
    });
