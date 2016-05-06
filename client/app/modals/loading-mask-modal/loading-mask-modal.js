'use strict';

angular.module('officeManagementApp')
	.service('$loadingMask', function ($uibModal, $rootScope) {
		var loadingMask = {
			open: function (attrs, opts) {
				// Create a new scope so we can pass custom
				// variables into the splash modal
				var scope = $rootScope.$new();
				angular.extend(scope, attrs);
				opts = angular.extend(opts || {}, {
					backdrop: false,
					keyboard: false,
					scope: scope,
					templateUrl: 'app/modals/loading-mask-modal/loading-mask-modal.html',
					windowTemplateUrl: 'app/modals/loading-mask-modal/loading-mask-modal.template.html'
				});

				return $uibModal.open(opts);
			}
		};

		return loadingMask;
	});