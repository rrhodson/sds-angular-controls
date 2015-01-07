/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formTimePicker () {
        return{
            restrict: 'E',
            replace: true,
            scope: {
                layoutCss       : '@?', //default col-md-6
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-directives/form-time-picker.html',
            link: function (scope, element) {
                // defaults

                var parentScope = element.parent().scope();

                parentScope.$watch('record', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.record = newVal;
                });

                parentScope.$watch('field', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.field = newVal;
                });

                parentScope.$watch('isRequired', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.isRequired = newVal;
                });

                parentScope.$watch('layout', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.layout = newVal;
                });

                scope.isReadonly = scope.isReadonly || false;

            }
        }
    }

    angular.module('sds-angular-controls').directive('formTimePicker', formTimePicker);
})();
