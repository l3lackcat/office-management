'use strict';

angular.module('officeManagementApp')
    .controller('MainController', function ($filter, $http, $loading, $q, $scope, _, PdfService) {
        $scope.buildingUnitList = [];
        $scope.buildingUnitFilter = {
            area: {
                list: [],
                selected: []
            },
            buildingName: '',
            priceRange: {
                list: [],
                selected: []
            },
            sizeRange: {
                list: [],
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
            return validateAreaFilter(item) && validateBuildingNameFilter(item) && validatePriceFilter(item) && validateSizeFilter(item);
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
                $scope.buildingUnitFilter.area.list = generateArrBuildingArea(buildingList);
                $scope.buildingUnitFilter.priceRange.list = generateArrRangeFilter(buildingUnitList, 'price', 500);
                $scope.buildingUnitFilter.sizeRange.list = generateArrRangeFilter(buildingUnitList, 'size', 200);

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

        function generateArrBuildingArea (buildingList) {
            var buildingAreaList = [];
            var arrAreaName = _.uniq(_.without(_.map(buildingList, 'area'), null));

            for(var i = arrAreaName.length - 1; i >= 0; i--) {
                buildingAreaList.push({
                    id: i,
                    name: arrAreaName[i]
                })
            }

            return _.sortBy(buildingAreaList, 'name');
        };

        function generateArrBuildingUnit (buildingUnitList) {
            for(var i = buildingUnitList.length - 1; i >= 0; i--) {
                buildingUnitList[i].selected = false;
            }

            return buildingUnitList;
        };

        function generateArrRangeFilter (buildingUnitList, propertyName, range) {
            if (buildingUnitList.length === 0) { return []; }

            var rangeFilterList = [];
            var maxValue = _.max(_.without(_.map(buildingUnitList, propertyName), null));
            var numRange = Math.ceil(maxValue / range);

            for(var i = 0; i < numRange; i++) {
                var min = range * i;
                var max = range + min;

                rangeFilterList.push({
                    id: i,
                    name: $filter('number')(min, 0) + ' to ' + $filter('number')(max, 0),
                    min: min,
                    max: max
                });
            }

            // rangeFilterList.push({
            //     id: 'custom',
            //     name: 'Custom...',
            //     min: null,
            //     max: null
            // });

            return rangeFilterList;
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
            var selectedAreaList = $scope.buildingUnitFilter.area.selected;

            if (selectedAreaList.length === 0) {
                return true;
            } else {
                var area = item.building.area;

                for(var i = selectedAreaList.length - 1; i >= 0; i--) {
                    if (selectedAreaList[i].name === area) {
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

        function validatePriceFilter (item) {
            var selectedPriceRangeList = $scope.buildingUnitFilter.priceRange.selected;

            if (selectedPriceRangeList.length === 0) {
                return true;
            } else {
                var price = item.price;

                for(var i = selectedPriceRangeList.length - 1; i >= 0; i--) {
                    if ((price >= selectedPriceRangeList[i].min) && (price <= selectedPriceRangeList[i].max)) {
                        return true;
                    }
                }
            }

            return false;
        };

        function validateSizeFilter (item) {
            var selectedSizeRangeList = $scope.buildingUnitFilter.sizeRange.selected;

            if (selectedSizeRangeList.length === 0) {
                return true;
            } else {
                var size = item.size;

                for(var i = selectedSizeRangeList.length - 1; i >= 0; i--) {
                    if ((size >= selectedSizeRangeList[i].min) && (size <= selectedSizeRangeList[i].max)) {
                        return true;
                    }
                }
            }

            return false;
        };
});