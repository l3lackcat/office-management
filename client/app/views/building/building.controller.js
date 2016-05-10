'use strict';

angular.module('officeManagementApp')
    .controller('BuildingCtrl', function ($loading, $q, $routeParams, $scope, $timeout, $uibModal, _, BuildingService, ExportUtil, Metadata) {
        $scope.building = null;
        $scope.buildingUnitList = [];
        $scope.isSelectAllBuildingUnit = false;
        $scope.actionButton = {
            disabled: true,
            isOpen: false
        };

        $scope.editingBuilding = null;
        $scope.editingProperty = '';

        $scope.trainStation = {
            bts: angular.copy(Metadata.TRAIN_STATION_LIST.BTS),
            mrt: angular.copy(Metadata.TRAIN_STATION_LIST.MRT)
        };

        $scope.init = init;

        $scope.exportSelection = exportSelection;
        $scope.printSelection = printSelection;
        $scope.removeSelection = removeSelection;
        $scope.setBuildingUnitAvaillable = setBuildingUnitAvaillable;

        $scope.toggleBuildingUnitSelection = toggleBuildingUnitSelection;
        $scope.updateBuildingUnitSelection = updateBuildingUnitSelection;

        $scope.updateBuilding = updateBuilding;
        $scope.startEditingBuilding = startEditingBuilding;
        $scope.cancelEditingBuilding = cancelEditingBuilding;

        $scope.openBuildingUnit = openBuildingUnit;

        $scope.init();

        function init () {
            var buildingId = $routeParams.buildingId;

            $loading.start('building');

            $q.all([
                BuildingService.getBuilding(buildingId),
                BuildingService.getBuildingUnitList(buildingId)
            ]).then(function (results) {
                $scope.building = results[0].data;
                $scope.buildingUnitList = results[1].data;

                $loading.finish('building');
            });
        };

        function exportSelection (fileType) {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });

            if (fileType === 'pdf') {
                ExportUtil.toPdf(selectedBuildingUnitList);
            }
        };

        function printSelection () {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });

            ExportUtil.print(selectedBuildingUnitList);
        };

        function removeSelection () {
            $loading.start('main');

            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });

            $q.all(BuildingService.removeBuildingUnit(selectedBuildingUnitList)).then(function (results) {
                var buildingIdList = [];

                for(var buildingUnitId in results) {
                    var result = results[buildingUnitId];

                    if (result.status === 204) {
                        var index = _.findIndex($scope.buildingUnitList, { _id: buildingUnitId });

                        if (index > -1) {
                            var buildingId = $scope.buildingUnitList[index].building._id;

                            if (buildingIdList.indexOf(buildingId) < 0) {
                                buildingIdList.push(buildingId);
                            }

                            $scope.buildingUnitList.splice(index, 1);
                        }
                    }
                }

                updateBuildingUnitSelection();
                // remove building with no units??

                $loading.finish('main');
            });
        };

        function setBuildingUnitAvaillable (isAvailable) {
            $loading.start('main');

            var selectedBuildingUnitList = angular.copy(_.filter($scope.buildingUnitList, { selected: true }));

            for(var i = selectedBuildingUnitList.length - 1; i >= 0; i--) {
                selectedBuildingUnitList[i].available = isAvailable;
            }

            $q.all(BuildingService.updateBuildingUnitList(selectedBuildingUnitList)).then(function (results) {
                for(var buildingUnitId in results) {
                    var result = results[buildingUnitId];

                    if (result.status === 200) {
                        var newBuildingUnit = result.data;
                        var oldBuildingUnit = _.find($scope.buildingUnitList, { _id: buildingUnitId });

                        if (oldBuildingUnit != null) {
                            oldBuildingUnit.available = newBuildingUnit.available;
                        }
                    }
                }

                $loading.finish('main');
            });
        };

        function toggleBuildingUnitSelection () {
            var isSelect = $scope.isSelectAllBuildingUnit;

            $scope.actionButton.disabled = !isSelect;

            for(var i = $scope.buildingUnitList.length - 1; i >= 0; i--) {
                $scope.buildingUnitList[i].selected = isSelect;
            }
        };

        function updateBuildingUnitSelection () {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });
            var selectedBuildingUnitCount = selectedBuildingUnitList.length;

            if (selectedBuildingUnitCount === $scope.buildingUnitList.length) {
                $scope.isSelectAllBuildingUnit = true;
                $scope.actionButton.disabled = false;
            } else {
                $scope.isSelectAllBuildingUnit = false;

                if (selectedBuildingUnitCount === 0) {
                    $scope.actionButton.disabled = true;
                } else {
                    $scope.actionButton.disabled = false;
                }
            }
        };

        function openBuildingUnit (buildingUnitId) {
            var modalInstance = null;
            var options = _.find(Metadata.MODAL_LIST, { name: 'BuildingUnitModal' });

            if (options != null) {
                var buildingUnit = _.find($scope.buildingUnitList, { _id: buildingUnitId });

                if (buildingUnit != null) {
                    options.resolve = {
                        buildingUnit: function () {
                            return buildingUnit;
                        }
                    };
                } else {
                    options.resolve = {
                        buildingUnit: function () {
                            return {
                                building: $scope.building._id,
                                name: '',
                                floor: '',
                                size: undefined,
                                price: undefined,
                                type: 'Office',
                                available: true,
                                remark: '',
                                contact: ''
                            };
                        }
                    };
                }

                modalInstance = $uibModal.open(options);
                modalInstance.result.then(function (editedBuildingUnit) {
                    if (editedBuildingUnit.hasOwnProperty('_id') === true) {
                        updateBuildingUnit(editedBuildingUnit);
                    } else {
                        insertBuildingUnit(editedBuildingUnit);
                    }
                });
            }
        };

        function insertBuildingUnit (editedBuildingUnit) {
            $loading.start('update-building-unit');

            $q.all([
                BuildingService.insertBuildingUnit(editedBuildingUnit)
            ]).then(function (results) {
                $scope.buildingUnitList.push(results[0].data);

                $loading.finish('update-building-unit');
            });
        };

        function updateBuildingUnit (editedBuildingUnit) {
            $loading.start('update-building-unit');

            $q.all([
                BuildingService.updateBuildingUnit(editedBuildingUnit)
            ]).then(function (results) {
                var updatedBuildingUnit = results[0].data;
                var index = _.findIndex($scope.buildingUnitList, { _id: updatedBuildingUnit._id });

                if (index > -1) {
                    $scope.buildingUnitList[index] = angular.copy(updatedBuildingUnit);

                    $loading.finish('update-building-unit');
                }
            });
        };

        function updateBuilding () {
            $loading.start('update-building');

            $q.all([
                BuildingService.updateBuilding($scope.editingBuilding)
            ]).then(function (results) {
                $scope.building = angular.copy(results[0].data);
                $scope.editingBuilding = null;
                $scope.editingProperty = '';

                $loading.finish('update-building');
            });
        };

        function startEditingBuilding (propertyName, elementId) {
            $scope.editingBuilding = angular.copy($scope.building);
            $scope.editingProperty = propertyName;

            $timeout(function () {
                var element = angular.element('#' + elementId)[0];

                if (element != null) {
                    element.focus();
                }
            });
        };

        function cancelEditingBuilding () {
            $scope.editingBuilding = null;
            $scope.editingProperty = '';
        };
    });
