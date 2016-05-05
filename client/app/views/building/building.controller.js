'use strict';

angular.module('officeManagementApp')
    .controller('BuildingCtrl', function ($http, $q, $routeParams, $scope, $uibModal, _, AppConstant) {
        $scope.building = null;
        $scope.buildingUnitList = [];
        $scope.isSelectAllBuildingUnit = false;
        $scope.actionButton = {
            disabled: true,
            isOpen: false
        };

        $scope.editingBuilding = null;
        $scope.editingProperty = '';

        $scope.exportToPdf = exportToPdf;
        $scope.init = init;
        $scope.openBuildingUnit = openBuildingUnit;
        $scope.setBuildingUnitAvaillable = setBuildingUnitAvaillable;
        $scope.toggleBuildingUnitSelection = toggleBuildingUnitSelection;
        $scope.updateBuildingUnitSelection = updateBuildingUnitSelection;

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

        function openBuildingUnit (buildingUnitId) {
            var buildingUnit = _.find($scope.buildingUnitList, { _id: buildingUnitId });

            if (buildingUnit != null) {
                var options = _.find(AppConstant.MODAL_LIST, { name: 'BuildingUnitModal' });

                if (options != null) {
                    var modalInstance = $uibModal.open(options);
                }
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

        $scope.saveEditing = function () {
            var buildingId = $scope.building._id;

            $http.put('/api/buildings/' + buildingId, $scope.editingBuilding).success(function (newBuilding) {
                $scope.building = angular.copy(newBuilding);
                $scope.editingBuilding = null;
                $scope.editingProperty = '';
            });
        };

        $scope.startEditing = function (propertyName) {
            $scope.editingBuilding = angular.copy($scope.building);
            $scope.editingProperty = propertyName;
        };

        $scope.stopEditing = function () {
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

        function init () {
            var buildingId = $routeParams.buildingId;

            $q.all([
                getBuilding(buildingId),
                getBuildingUnitList(buildingId)
            ]).then(function (results) {
                $scope.building = results[0].data;
                $scope.buildingUnitList = results[1].data;
            });
        };

        $scope.init();
    });
