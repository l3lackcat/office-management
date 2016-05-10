'use strict';

angular.module('officeManagementApp')
    .controller('MainController', function ($filter, $http, $loading, $q, $scope, _, Metadata, AppUtil, BuildingService, ExportUtil) {
        $scope.buildingUnitList = [];
        $scope.buildingFilter = angular.copy(Metadata.BUILDING_FILTER);
        $scope.isSelectAllBuildingUnit = false;
        $scope.actionButton = {
            disabled: true,
            isOpen: false
        };

        $scope.init = init;
        $scope.applyFilter = applyFilter;

        $scope.exportSelection = exportSelection;
        $scope.printSelection = printSelection;
        $scope.removeSelection = removeSelection;
        $scope.setBuildingUnitAvaillable = setBuildingUnitAvaillable;

        $scope.toggleBuildingUnitSelection = toggleBuildingUnitSelection;
        $scope.updateBuildingUnitSelection = updateBuildingUnitSelection;

        $scope.init();

        function init () {
            $loading.start('main');

            $q.all([
                BuildingService.getBuildingUnitList()
            ]).then(function (results) {
                var buildingUnitList = results[0].data;

                $scope.buildingUnitList = buildingUnitList;
                $scope.buildingFilter.location.list = AppUtil.createLocationFilterList(buildingUnitList);

                $loading.finish('main');
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

            $q.all(BuildingService.updateBuildingUnit(selectedBuildingUnitList)).then(function (results) {
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

        function applyFilter (item) {
            var result = true;

            result = result && validateBuildingNameFilter(item);
            result = result && validateBuildingLocationFilter(item);
            result = result && validateBuildingUnitTypeFilter(item);
            result = result && validateBuildingUnitAreaFilter(item);
            result = result && validateBuildingUnitPriceFilter(item);
            result = result && validateBuildingUnitNetPriceFilter(item);

            return result;

            function validateBuildingNameFilter (item) {
                var strBuildingName = $scope.buildingFilter.name;

                if (strBuildingName === '') { return true; }
                if (item.building.name.toUpperCase().indexOf(strBuildingName.toUpperCase()) > -1) { return true; }

                return false;
            };

            function validateBuildingLocationFilter (item) {
                var selectedLocationList = $scope.buildingFilter.location.selected;

                if (selectedLocationList.length === 0) {
                    return true;
                } else {
                    for(var i = selectedLocationList.length - 1; i >= 0; i--) {
                        if (selectedLocationList[i].name === item.building.location) {
                            return true;
                        }
                    }
                }

                return false;
            };

            function validateBuildingUnitTypeFilter (item) {
                var selectedFilterList = $scope.buildingFilter.unit.type.selected;

                if (selectedFilterList.length === 0) {
                    return true;
                } else {
                    for(var i = selectedFilterList.length - 1; i >= 0; i--) {
                        if (selectedFilterList[i].name === item.type) {
                            return true;
                        }
                    }
                }

                return false;
            };

            function validateBuildingUnitAreaFilter (item) {
                var selectedFilterList = $scope.buildingFilter.unit.area.selected;

                if (selectedFilterList.length === 0) {
                    return true;
                } else {
                    for(var i = selectedFilterList.length - 1; i >= 0; i--) {
                        var isValid = AppUtil.isBetween(item.area, selectedFilterList[i].min, selectedFilterList[i].max);

                        if (isValid === true) {
                            return true;
                        }
                    }
                }

                return false;
            };

            function validateBuildingUnitPriceFilter (item) {
                var selectedFilterList = $scope.buildingFilter.unit.price.selected;

                if (selectedFilterList.length === 0) {
                    return true;
                } else {
                    for(var i = selectedFilterList.length - 1; i >= 0; i--) {
                        var isValid = AppUtil.isBetween(item.price, selectedFilterList[i].min, selectedFilterList[i].max);

                        if (isValid === true) {
                            return true;
                        }
                    }
                }

                return false;
            };

            function validateBuildingUnitNetPriceFilter (item) {
                var selectedFilterList = $scope.buildingFilter.unit.netPrice.selected;

                if (selectedFilterList.length === 0) {
                    return true;
                } else {
                    for(var i = selectedFilterList.length - 1; i >= 0; i--) {
                        var isValid = AppUtil.isBetween(item.area * item.price, selectedFilterList[i].min, selectedFilterList[i].max);

                        if (isValid === true) {
                            return true;
                        }
                    }
                }

                return false;
            };
        };
});