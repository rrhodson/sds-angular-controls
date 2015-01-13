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
                style           : '@?',
                layoutCss       : '@?', //default col-md-6
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-directives/form-autocomplete.html',

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

                scope.orderHash = function(obj){
                    if (!obj) {
                        return [];
                    }
                    return obj.orderedKeys || Object.keys(obj);
                };

                function watchChanges (){
                    if(scope.items && _.isArray(scope.items)) {
                        var sel = element.find('.autocomplete');
                        if (sel[0].selectize){
                            sel[0].selectize.destroy();
                        }
                        var options = {
                            options: angular.copy(scope.items),
                            valueField: scope.itemKey,
                            labelField: scope.itemValue,
                            searchField: [scope.itemValue],
                            onChange: function (value){
                                $timeout(function (){
                                    scope.record[scope.field] = value;
                                });
                            },
                            maxOptions: 10
                        };

                        if (scope.itemGroupKey && _.isArray(scope.groups)){
                            options.optgroups =  scope.groups;
                            options.optgroupField = scope.itemGroupKey;
                            options.optgroupValueField = scope.itemGroupKey;
                            options.optgroupLabelField = scope.itemGroupValue;
                        }
                        console.log(options);
                        sel.selectize(options).val(scope.record[scope.field]);
                    }
                }

                scope.$watch("items", watchChanges);
            }
        }
    }

    angular.module('sds-angular-controls').directive('formAutocomplete', formAutocomplete);
})();
