'use strict';

angular.module('officeManagementApp')
    .controller('BuildingCtrl', function ($http, $loading, $q, $routeParams, $scope, $timeout, $uibModal, _, AppConstant, PdfService) {
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
            bts: angular.copy(AppConstant.TRAIN_STATION_LIST.BTS),
            mrt: angular.copy(AppConstant.TRAIN_STATION_LIST.MRT)
        };

        $scope.exportToPdf = exportToPdf;
        $scope.init = init;
        $scope.openBuildingUnit = openBuildingUnit;
        $scope.print = print;
        $scope.setBuildingUnitAvaillable = setBuildingUnitAvaillable;
        $scope.toggleBuildingUnitSelection = toggleBuildingUnitSelection;
        $scope.updateBuildingUnitSelection = updateBuildingUnitSelection;

        $scope.updateBuilding = updateBuilding;
        $scope.startEditingBuilding = startEditingBuilding;
        $scope.cancelEditingBuilding = cancelEditingBuilding;

        // $scope.updateBuildingUnit = updateBuildingUnit;

        $scope.init();

        function exportToPdf () {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });
            
            if (selectedBuildingUnitList.length === 0) {
                // TODO
            } else {
                PdfService.createBuildingDetailReport(selectedBuildingUnitList);
            }
        };

        function getBuilding (buildingId) {
            return $http.get('/api/buildings/' + buildingId).success(function (buildingList) {
                return buildingList;
            });
        };

        function getBuildingUnitList (buildingId) {
            return $http.get('/api/building-units/buildingId/' + buildingId).success(function (buildingUnitList) {
                return buildingUnitList;
            });
        };

        function init () {
            var buildingId = $routeParams.buildingId;

            $loading.start('building');

            $q.all([
                getBuilding(buildingId),
                getBuildingUnitList(buildingId)
            ]).then(function (results) {
                $scope.building = results[0].data;
                $scope.buildingUnitList = results[1].data;

                $loading.finish('building');
            });
        };

        function openBuildingUnit (buildingUnitId) {
            var modalInstance = null;
            var options = _.find(AppConstant.MODAL_LIST, { name: 'BuildingUnitModal' });

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

        function print () {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });
            
            if (selectedBuildingUnitList.length === 0) {
                // TODO
            } else {
                PdfService.createBuildingDetailReport(selectedBuildingUnitList, 'print');
            }
        };

        function setBuildingUnitAvaillable (isAvailable) {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });
            var buildingUnitPromise = [];

            for(var i = selectedBuildingUnitList.length - 1; i >= 0; i--) {
                var buildingUnit = selectedBuildingUnitList[i];

                buildingUnit.available = isAvailable;

                buildingUnitPromise.push($http.put('/api/building-units/' + buildingUnit._id, buildingUnit));
            }

            if (buildingUnitPromise.length > 0) {
                $q.all(buildingUnitPromise).then(function (results) {
                    // TODO
                });
            }
        };

        function updateBuilding () {
            var buildingId = $scope.building._id;

            $loading.start('update-building');

            $http.put('/api/buildings/' + buildingId, $scope.editingBuilding).success(function (newBuilding) {
                $scope.building = angular.copy(newBuilding);
                $scope.editingBuilding = null;
                $scope.editingProperty = '';

                $loading.finish('update-building');
            });
        };

        function insertBuildingUnit (editedBuildingUnit) {
            $loading.start('update-building-unit');

            $http.post('/api/building-units', editedBuildingUnit).success(function (insertedBuildingUnit) {
                $scope.buildingUnitList.push(insertedBuildingUnit);

                $loading.finish('update-building-unit');
            });
        };

        function updateBuildingUnit (editedBuildingUnit) {
            $loading.start('update-building-unit');

            $http.put('/api/building-units/' + editedBuildingUnit._id, editedBuildingUnit).success(function (updatedBuildingUnit) {
                var index = _.findIndex($scope.buildingUnitList, { _id: updatedBuildingUnit._id });

                if (index > -1) {
                    $scope.buildingUnitList[index] = angular.copy(updatedBuildingUnit);

                    $loading.finish('update-building-unit');
                }
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
    });
