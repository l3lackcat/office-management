'use strict';

angular.module('officeManagementApp')
    .controller('MainController', function ($filter, $http, $loading, $q, $scope, _, AppConstant, PdfService) {
        $scope.buildingUnitList = [];
        $scope.buildingUnitFilter = {
            buildingName: '',
            areaRange: {
                list: AppConstant.AREA_RANGE_LIST,
                selected: []
            },
            location: {
                list: [],
                selected: []
            },
            netPriceRange: {
                list: AppConstant.NET_PRICE_RANGE_LIST,
                selected: []
            },
            priceRange: {
                list: AppConstant.PRICE_RANGE_LIST,
                selected: []
            },
            type: {
                list: [
                    { id: 0, name: 'Office' },
                    { id: 1, name: 'Retail' }
                ],
                selected: []
            }
        };
        $scope.isSelectAllBuildingUnit = false;
        $scope.actionButton = {
            disabled: true,
            isOpen: false
        };

        $scope.applyFilter = applyFilter;
        $scope.exportToPdf = exportToPdf;
        $scope.init = init;
        $scope.print = print;
        $scope.setBuildingUnitAvaillable = setBuildingUnitAvaillable;
        $scope.toggleBuildingUnitSelection = toggleBuildingUnitSelection;
        $scope.updateBuildingUnitSelection = updateBuildingUnitSelection;

        $scope.init();

        function applyFilter (item) {
            return validateBuildingNameFilter(item) && validateLocationFilter(item) && validateAreaFilter(item) && validateNetPriceFilter(item) && validatePriceFilter(item) && validateTypeFilter(item);
        };

        function exportToPdf () {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });
            
            if (selectedBuildingUnitList.length === 0) {
                // TODO
            } else {
                PdfService.createBuildingDetailReport(selectedBuildingUnitList);
            }
        };

        function getBuildingList () {
            return $http.get('/api/buildings').success(function (buildingList) {
                return buildingList;
            });
        };

        function getBuildingUnitList () {
            return $http.get('/api/building-units').success(function (buildingUnitList) {
                return buildingUnitList;
            });
        };

        function init () {
            $loading.start('main');

            $q.all([
                getBuildingList(),
                getBuildingUnitList()
            ]).then(function (results) {
                var buildingList = results[0].data;
                var buildingUnitList = results[1].data;

                $scope.buildingUnitList = buildingUnitList;
                $scope.buildingUnitFilter.location.list = generateArrBuildingLocation(buildingList);

                $loading.finish('main');
            });
        };

        function print () {
            var selectedBuildingUnitList = _.filter($scope.buildingUnitList, { selected: true });
            
            if (selectedBuildingUnitList.length === 0) {
                // TODO
            } else {
                PdfService.createBuildingDetailReport(selectedBuildingUnitList, 'print');
            }
        };

        function generateArrBuildingLocation (buildingList) {
            var buildingLocationList = [];
            var possibleLocationList = _.uniq(_.without(_.map(buildingList, 'location'), null));

            for(var i = possibleLocationList.length - 1; i >= 0; i--) {
                buildingLocationList.push({
                    id: i,
                    name: possibleLocationList[i]
                });
            }

            return _.sortBy(buildingLocationList, 'name');
        };

        function generateArrBuildingUnitType (buildingUnitList) {
            var buildingUnitTypeList = [];
            var possibleUnitTypeList = _.uniq(_.without(_.map(buildingUnitList, 'type'), null));

            for(var i = possibleUnitTypeList.length - 1; i >= 0; i--) {
                buildingUnitTypeList.push({
                    id: i,
                    name: possibleUnitTypeList[i]
                });
            }

            return _.sortBy(buildingUnitTypeList, 'name');
        };

        function generateArrBuildingUnit (buildingUnitList) {
            for(var i = buildingUnitList.length - 1; i >= 0; i--) {
                buildingUnitList[i].selected = false;
            }

            return buildingUnitList;
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
                    // Do Nothing
                });
            }
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

        function validateAreaFilter (item) {
            var selectedAreaRangeList = $scope.buildingUnitFilter.areaRange.selected;

            if (selectedAreaRangeList.length === 0) {
                return true;
            } else {
                for(var i = selectedAreaRangeList.length - 1; i >= 0; i--) {
                    var isValid = validateRange(item.area, selectedAreaRangeList[i].min, selectedAreaRangeList[i].max);

                    if (isValid === true) {
                        return true;
                    }
                }
            }

            return false;
        };

        function validateBuildingNameFilter (item) {
            var strBuildingName = $scope.buildingUnitFilter.buildingName;

            if (strBuildingName === '') { return true; }
            if (item.building.name.toUpperCase().indexOf(strBuildingName.toUpperCase()) > -1) { return true; }

            return false;
        };

        function validateLocationFilter (item) {
            var selectedLocationList = $scope.buildingUnitFilter.location.selected;

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

        function validateNetPriceFilter (item) {
            var selectedNetPriceRangeList = $scope.buildingUnitFilter.netPriceRange.selected;

            if (selectedNetPriceRangeList.length === 0) {
                return true;
            } else {
                for(var i = selectedNetPriceRangeList.length - 1; i >= 0; i--) {
                    var isValid = validateRange(item.area * item.price, selectedNetPriceRangeList[i].min, selectedNetPriceRangeList[i].max);

                    if (isValid === true) {
                        return true;
                    }
                }
            }

            return false;
        };

        function validatePriceFilter (item) {
            var selectedPriceRangeList = $scope.buildingUnitFilter.priceRange.selected;

            if (selectedPriceRangeList.length === 0) {
                return true;
            } else {
                for(var i = selectedPriceRangeList.length - 1; i >= 0; i--) {
                    var isValid = validateRange(item.price, selectedPriceRangeList[i].min, selectedPriceRangeList[i].max);

                    if (isValid === true) {
                        return true;
                    }
                }
            }

            return false;
        };

        function validateTypeFilter (item) {
            var selectedTypeList = $scope.buildingUnitFilter.type.selected;

            if (selectedTypeList.length === 0) {
                return true;
            } else {
                for(var i = selectedTypeList.length - 1; i >= 0; i--) {
                    if (selectedTypeList[i].name === item.type) {
                        return true;
                    }
                }
            }

            return false;
        };

        function validateRange (input, min, max) {
            if ((min !== null) && (max !== null)) {
                if ((input >= min) && (input <= max)) {
                    return true;
                }
            } else if ((min !== null) && (max === null)) {
                if (input >= min) {
                    return true;
                }
            } else if ((min === null) && (max !== null)) {
                if (input <= max) {
                    return true;
                }
            }

            return false;
        };
});