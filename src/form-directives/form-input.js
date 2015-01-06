/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formInput ($filter) {
        return{
            restrict: 'EA',
            require: '^formField',
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
                isReadonly      : '=?',  //boolean
                isNumeric       : '=?'
            },
            templateUrl: 'sds-angular-controls/form-directives/form-input.html',
            link: function (scope, element, attr, formField) {
                // defaults

                element.parent().scope().$watch('record', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.record = newVal;
                });

                element.parent().scope().$watch('field', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.field = newVal;
                });

                element.parent().scope().$watch('isRequired', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.isRequired = newVal;
                });

                element.parent().scope().$watch('layout', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.layout = newVal;
                });

                element.parent().scope().$watch('label', function(newVal, oldVal){
                    //formField.setValue(newVal[scope.field]);
                    scope.label = newVal;
                    scope.placeholder = scope.placeholder || newVal;
                });

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;
                scope.type = scope.type || "text";


                if(scope.min) {
                    formField.setMin(scope.min);
                }

                if(scope.max) {
                    formField.setMax(scope.max);
                }

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

    angular.module('sds-angular-controls').directive('formInput', formInput);
})();
