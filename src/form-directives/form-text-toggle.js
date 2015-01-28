/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formTextToggle ($filter) {
        return{
            restrict: 'EA',
            replace: true,
            scope: {
                placeholder     : '@?',
                toggleField     : '@?', //one-way binding
                toggleSwitchType: '@?',
                onLabel         : '@?',
                offLabel        : '@?',
                style           : '@?',
                type            : '@',  //text, email, number etc.. see the InputTypes
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-directives/form-text-toggle.html',
            link: function (scope, element) {
                // defaults
                var parentScope = element.parent().scope();
                parentScope.$watch('record', function(newVal, oldVal){

                    scope.record = newVal;
                });

                parentScope.$watch('field', function(newVal, oldVal){

                    scope.field = newVal;
                });

                parentScope.$watch('isRequired', function(newVal, oldVal){

                    scope.isRequired = newVal;
                });

                parentScope.$watch('isReadonly', function(newVal, oldVal){
                    scope.isReadonly = newVal;
                });

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;
                scope.type = scope.type || "text";

                scope.toggleSwitchType = scope.toggleSwitchType || "primary";
                scope.onLabel = scope.onLabel   || "Yes";
                scope.offLabel = scope.offLabel || "No";

            }
        }
    }

    angular.module('sds-angular-controls').directive('formTextToggle', formTextToggle);
})();
