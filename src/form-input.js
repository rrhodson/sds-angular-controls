/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formInput ($filter, $rootScope) {
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
            templateUrl: 'sds-angular-controls/form-input.html',

            link: function (scope, element, attr, formField) {
                // defaults
                scope.record     = formField.getRecord();
                scope.field      = formField.getField();
                scope.isRequired = formField.getRequired();
                scope.layout     = formField.getLayout();

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;
                scope.type = scope.type || "text";

                if(scope.isNumeric){
                    $(element).prop("auto-numeric", true);
                }

                if(scope.min) {
                    $rootScope.$broadcast("input-min", {field: scope.field, min: scope.min});
                }

                if(scope.max) {
                    $rootScope.$broadcast("input-max", {field: scope.field, max: scope.max});
                }

                switch(scope.layout){
                    case "horizontal":
                        scope.layoutCss = scope.layoutCss || "col-md-6";
                        break;
                    default: //stacked
                        scope.layoutCss = scope.layoutCss || "col-md-4";
                }

                scope.placeholder = scope.placeholder ||  $filter("labelCase")(scope.field);

                scope.$watch("record", function(newVal, oldVal){
                    formField.setValue(newVal[scope.field]);
                });
            }
        }
    }

    angular.module('sds-angular-controls').directive('formInput', formInput);
})();
