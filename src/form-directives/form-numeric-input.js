/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formNumericInput ($filter) {
        return{
            restrict: 'EA',
            replace: true,
            scope: {
                log             : '@?',
                placeholder     : '@?',
                style           : '@?',
                layoutCss       : '@?', //default col-md-6
                rightLabel      : '@?',
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-directives/form-numeric-input.html',
            link: function (scope, element) {

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

                parentScope.$watch('label', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.label = newVal;
                    scope.placeholder = scope.placeholder || newVal;
                });

                parentScope.$watch('isReadonly', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.isReadonly = newVal;
                });

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;

                switch(scope.layout){
                    case "horizontal":
                        scope.layoutCss = scope.layoutCss || "col-md-6";
                        break;
                    default: //stacked
                        scope.layoutCss = scope.layoutCss || "col-md-4";
                }




                scope.$watch("isReadonly", function(newVal, oldVal){
                    if(newVal && oldVal) {
                        if (newVal !== oldVal) {
                            checkIfReadonly();
                        }
                    }
                });

                function checkIfReadonly(){
                    if(scope.isReadonly) {
                        if (scope.fieldType === 'toggle') {
                            scope.readOnlyModel = scope.record[scope.field];
                        }
                    }
                }
            }
        }
    }

    angular.module('sds-angular-controls').directive('formNumericInput', formNumericInput);
})();
