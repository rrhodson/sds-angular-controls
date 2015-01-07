/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formTextArea () {
        return{
            restrict: 'EA',
            replace: true,
            scope: {
                log             : '@?',
                style           : '@?',
                layoutCss       : '@?', //default col-md-6
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-directives/form-text-area.html',
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

                parentScope.$watch('label', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.label = newVal;
                    scope.placeholder = scope.placeholder || newVal;
                });

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;
                scope.type = scope.type || "text";

                scope.layoutCss = scope.layoutCss || "col-md-6";



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

    angular.module('sds-angular-controls').directive('formTextArea', formTextArea);
})();
