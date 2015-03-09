/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formTextToggle ($timeout) {
        return{
            restrict: 'EA',
            replace: true,
            require: '^form-field',
            scope: {
                placeholder     : '@?',
                toggleField     : '@?', //one-way binding
                toggleSwitchType: '@?',
                onLabel         : '@?',
                offLabel        : '@?',
                style           : '@?',
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-text-toggle.html',
            link: function (scope, element, attr, container) {
                var input = element.find('input');
                scope.container = container.$scope;

                if (attr.layoutCss && container.$scope.layout === 'horizontal'){
                    scope.watch('layoutCss', function (){container.$scope.childLayoutCss = scope.layoutCss; });
                }

                if (container.$scope.isAutofocus){
                    $timeout(function (){element.find('input').focus(); });
                }

                scope.type = attr.type || "text";

                scope.toggleSwitchType = scope.toggleSwitchType || "primary";
                scope.onLabel = scope.onLabel   || "Yes";
                scope.offLabel = scope.offLabel || "No";
            }
        }
    }

    angular.module('sds-angular-controls').directive('formTextToggle', formTextToggle);
})();
