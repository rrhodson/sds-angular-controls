/**
 * Created by stevegentile on 12/19/14.
 */

/* TODO: move these hacks into selectize-ng

 <select ng-if="!container.isReadonly && !reload"
 ng-readonly="container.isReadonly"
 ng-required="container.isRequired"
 name="{{::container.field}}"
 selectize="options"
 options="innerItems"
 class="{{::container.layout !== 'horizontal' ? layoutCss : ''}}"
 ng-model="container.record[container.field]"></select>
 <!-- optionValue as optionLabel for arrayItem in array -->

(function () {
    'use strict';
    function formAutocomplete ($timeout) {
        return{
            restrict: 'EA',
            require: '^formField',
            replace: true,
            scope: {
                items           : '=',
                groups          : '=?',
                itemKey         : '@?',
                itemValue       : '@?',
                itemSort        : '@?',
                itemGroupKey    : '@?',
                itemGroupValue  : '@?',
                dropdownDirection:'@?',
                allowCustom     : '=?'
            },
            templateUrl: 'sds-angular-controls/form-directives/form-autocomplete.html',

            link: function (scope, element, attr, container) {
                scope.container = container.$scope;
                scope.innerItems = [];
                //// hack to force reloading options
                scope.$watch("items", function(newVal, oldVal){
                    if(scope.items && !_.isArray(scope.items)){
                        scope.innerItems = convertToArray();
                    }else{
                        var i = 0;
                        scope.innerItems = _.map(scope.items, function (v){
                            v.__sort = i++;
                            return v;
                        });
                    }

                    if(newVal && newVal !== oldVal){
                        scope.reload = true;
                        $timeout(function (){
                            scope.reload = false;
                        });
                    }
                });

                // one-time bindings:
                if (attr.layoutCss && container.$scope.layout === 'horizontal'){
                    scope.$watch('layoutCss', function (){container.$scope.childLayoutCss = scope.layoutCss; });
                }


                function convertToArray(){
                    var i = 0;
                    var items = _.reduce(scope.items, function(result, item, key) {
                        //result[item["item-key"]] = item["item-value"];
                        result.push({
                            "itemKey" : key,
                            "itemValue": item,
                            "__sort": i++
                        });

                        return result;
                    }, []);
                    scope.options.valueField = "itemKey";
                    scope.options.labelField = "itemValue";
                    scope.options.searchField = ["itemValue"];
                    scope.reload = true;
                    $timeout(function (){
                        scope.reload = false;
                    });

                    return items;
                }


                var options = {
                    plugins: ['dropdown_direction'],
                    dropdownDirection: scope.dropdownDirection || 'auto',
                    valueField: scope.itemKey,
                    labelField: scope.itemValue,
                    searchField: [scope.itemValue],
                    sortField:  scope.itemSort || '__sort',
                    maxOptions: 1200
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

                    scope.$watch('groups', function (val, old){
                        if (val !== old){
                            scope.options.optgroups =  scope.groups;
                            scope.reload = true;
                            $timeout(function (){
                                scope.reload = false;
                            });
                        }
                    });
                }

                scope.options = options;
            }
        }
    }

    angular.module('sds-angular-controls').directive('formAutocomplete', formAutocomplete);

})();
*/