'use strict';

angular.module('officeManagementApp')
    .run(function (AppConstant) {
        AppConstant['MODAL_LIST'] = [
            {
                name: 'BuildingUnitModal',
                templateUrl: 'app/modals/building-unit-modal/building-unit-modal.html',
                controller: 'BuildingUnitModalCtrl',
                backdrop: 'static',
                keyboard: true
            },
            {
                name: 'BuildingViewerModal',
                templateUrl: 'app/modals/building-viewer-modal/building-viewer-modal.html',
                controller: 'BuildingViewerModalCtrl',
                backdrop: 'static',
                keyboard: true,
                size: 'lg'
            },
            {
                name: 'CustomRangeModal',
                templateUrl: 'app/modals/custom-range-modal/custom-range-modal.html',
                controller: 'CustomRangeModalCtrl',
                backdrop: 'static',
                keyboard: true,
                size: 'sm'
            }
        ];
    });
