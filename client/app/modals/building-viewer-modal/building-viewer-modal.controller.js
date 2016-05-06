'use strict';

angular.module('officeManagementApp')
    .controller('BuildingViewerModalCtrl', function ($loading, $q, $scope, $uibModalInstance, buildingList) {
        $scope.buildingUnitList = [];

        $scope.cancel = cancel;
        $scope.init = init;
        $scope.ok = ok;

        $scope.init();

        function cancel () {
            $uibModalInstance.dismiss('cancel');
        };

        function createBuildingUnitList (buildingList) {
            for(var i = buildingList.length - 1; i >= 0; i--) {
                var building = buildingList[i];
                var buildingUnitList = building.units;

                for(var j = buildingUnitList.length - 1; j >= 0; j--) {
                    var buildingUnit = buildingUnitList[j];

                    $scope.buildingUnitList.push({
                        building: {
                            name: building.name,
                            area: building.area
                        },
                        name: buildingUnit.name,
                        floor: buildingUnit.floor,
                        size: buildingUnit.size,
                        price: buildingUnit.price,
                        type: buildingUnit.type,
                        available: buildingUnit.available,
                        remark: buildingUnit.remark,
                        contact: buildingUnit.contact
                    });
                }
            }
        };

        function init () {
            $loading.start('building-viewer-modal');

            $q.all([
                createBuildingUnitList(buildingList)
            ]).then(function (results) {
                $loading.finish('building-viewer-modal');
            });
        };

        function ok () {
            $uibModalInstance.close();
        };
    });
