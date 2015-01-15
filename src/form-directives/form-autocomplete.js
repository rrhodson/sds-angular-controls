/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formAutocomplete ($filter, $rootScope, $timeout) {
        return{
            restrict: 'EA',
            //require: '^formField',
            replace: true,
            scope: {
                items           : '=',
                groups          : '=?',
                itemKey         : '@?',
                itemValue       : '@?',
                itemGroupKey    : '@?',
                itemGroupValue  : '@?',
                log             : '@?',
                allowCustom     : '=?',
                style           : '@?',
                layoutCss       : '@?', //default col-md-6
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-directives/form-autocomplete.html',

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
                });

                parentScope.$watch('isReadonly', function(newVal, oldVal){

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

                var options = {
                    valueField: scope.itemKey,
                    labelField: scope.itemValue,
                    searchField: [scope.itemValue],
                    maxOptions: 10
                };

                if (scope.allowCustom){
                    options.persist = false;
                    options.create = true;
                }

                if (scope.itemGroupKey && _.isArray(scope.groups)){
                    options.optgroups =  scope.groups;
                    options.optgroupField = scope.itemGroupKey;
                    options.optgroupValueField = scope.itemGroupKey;
                    options.optgroupLabelField = scope.itemGroupValue;
                }

                scope.options = options;
            }
        }
    }

    angular.module('sds-angular-controls').directive('formAutocomplete', formAutocomplete);
})();
