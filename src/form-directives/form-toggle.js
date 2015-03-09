/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formToggle ($filter) {
        return{
            restrict: 'EA',
            replace: true,
            require: '^form-field',
            scope: {
                toggleSwitchType: '@?',
                onLabel         : '@?',
                offLabel        : '@?',
                style           : '@?',
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-toggle.html',
            link: function (scope, element, attr, container) {
                scope.container = container.$scope;

                if (attr.layoutCss && container.$scope.layout === 'horizontal'){
                    scope.watch('layoutCss', function (){container.$scope.childLayoutCss = scope.layoutCss; });
                }

                scope.toggleSwitchType = scope.toggleSwitchType || "primary";
                scope.onLabel = scope.onLabel   || "Yes";
                scope.offLabel = scope.offLabel || "No";
            }
        }
    }

    angular.module('sds-angular-controls').directive('formToggle', formToggle);
})();
