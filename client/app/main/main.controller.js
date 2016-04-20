'use strict';

angular.module('officeManagementApp')
  .controller('MainController', function ($q, $scope, $http) {
    // function getBuildingList () {
    //   $http.get('/api/buildings').success(function(buildingList) {
    //     $scope.buildingList = buildingList;
    //   });
    // };

    function getBuildingList () {
      $http.get('/api/buildings').success(function (buildingList) {
        $scope.buildingList = angular.copy(buildingList);
        // $scope.updateTableThrottle();
      });
    }
    
    // function updateTable () {
    //   $scope.filteredRoomList = [];

    //   $q.all([
    //     applyFilter()
    //   ])
    //   .then(function () {
    //     // Do Nothing.
    //   });
    // }

    // function checkBetween (value, lower, upper) {
    //   if ((lower === '') && (upper === '')) { return true; }
    //   var isBetween = false;

    //   if (lower === '') { lower = 0; }
    //   if (upper === '') { upper = Infinity; }

    //   if ((value >= lower) && (value <= upper)) {
    //     isBetween = true;
    //   }

    //   return isBetween;
    // }

    // function applyFilter () {
    //   for(var i = 0; i < $scope.roomList.length; i++) {
    //     var room = $scope.roomList[i];

    //     if ((checkBetween(room.space, $scope.spaceFilter.lower, $scope.spaceFilter.upper) === true) &&
    //         (checkBetween(room.price, $scope.priceFilter.lower, $scope.priceFilter.upper) === true) &&
    //         (checkBetween(room.space * room.price, $scope.netPriceFilter.lower, $scope.netPriceFilter.upper) === true)) {
    //       $scope.filteredRoomList.push(room);
    //     }
    //   }
    // }

    // var updateTableThrottle = _.throttle(updateTable, 500);

    $scope.buildingList = getBuildingList();
    // $scope.filteredRoomList = [];
    // $scope.netPriceFilter = { lower: '', upper: '' };
    // $scope.priceFilter = { lower: '', upper: '' };
    // $scope.spaceFilter = { lower: '', upper: '' };
    // $scope.updateTableThrottle = updateTableThrottle;
  });

