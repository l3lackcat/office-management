'use strict';

angular.module('officeManagementApp')
    .run(function (AppConstant) {
        AppConstant['MODAL_LIST'] = [
            {
                name: 'BuildingUnitModal',
                templateUrl: 'app/views/dialogs/building-unit-modal/building-unit-modal.html',
                controller: 'BuildingUnitModalCtrl',
                backdrop: 'static',
                keyboard: true
            }
        ];
    });
