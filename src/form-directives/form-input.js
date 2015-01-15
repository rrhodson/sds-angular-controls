/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formInput ($filter) {
        return{
            restrict: 'E',
            replace: true,
            scope: {
                log             : '@?',
                placeholder     : '@?',
                mask            : '@?', //todo
                style           : '@?',
                max             : '@?',
                min             : '@?',
                type            : '@',  //text, email, number etc.. see the InputTypes
                layoutCss       : '@?', //default col-md-6
                inputLayout     : '@?',
                rightLabel      : '@?',
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-directives/form-input.html',
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

                parentScope.$watch('layout', function(newVal, oldVal){
                    scope.layout = newVal;
                    switch(scope.layout){
                        case "horizontal":
                            scope.inputLayout = scope.inputLayout || "col-md-6";
                            break;
                        default: //stacked
                            scope.inputLayout = scope.inputLayout || "col-md-4";
                    }
                });

                parentScope.$watch('isReadonly', function(newVal, oldVal){

                    scope.isReadonly = newVal;
                });

                scope.isReadonly = scope.isReadonly || false;

                parentScope.$watch('label', function(newVal, oldVal){

                    scope.label = newVal;
                    scope.placeholder = scope.placeholder || newVal;
                });

                scope.log = scope.log || false;
                scope.type = scope.type || "text";

                scope.min = parentScope.min;
                scope.max = parentScope.max;
            }
        }
    }

    angular.module('sds-angular-controls').directive('formInput', formInput);
})();
