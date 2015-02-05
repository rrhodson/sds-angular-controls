/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formSelect ($timeout) {
        return{
            restrict: 'EA',
            require: '^formField',
            replace: true,
            scope: {
                items           : '=',
                itemKey         : '@?',
                itemValue       : '@?',
                style           : '@?',
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-select.html',

            link: function (scope, element, attr, container) {
                var input = element.find('select');
                scope.container = container.$scope;

                // one-time bindings:
                switch(container.$scope.layout){
                    case "horizontal":
                        scope.layoutCss = scope.layoutCss || "col-md-6";
                        break;
                    default: //stacked
                        scope.layoutCss = scope.layoutCss || "";
                }

                if (container.$scope.isAutofocus){
                    $timeout(function (){input.focus(); });
                }

                scope.$watch("container.isReadonly", function(newVal){
                    if(newVal) {
                        if (scope.container.record && scope.container.record[scope.container.field]) {

                            var value = scope.items[scope.container.record[scope.container.field]];
                            //if using itemKey/itemValue -we need to find it in the array vs. hash:
                            if(scope.itemValue && scope.itemKey){
                                var arrayItem = _.find(scope.items, function(item){
                                   return item[scope.itemKey] === scope.container.record[scope.container.field];
                                });
                                value = arrayItem[scope.itemValue];
                            }
                            scope.readOnlyModel = value;
                        }
                    }
                });

                scope.orderHash = function(obj){
                    if (!obj) {
                        return [];
                    }
                    return obj.orderedKeys || Object.keys(obj);
                };

                function convertToHash(items, itemKey, itemValue){
                    var OrderedDictionary = function (){};
                    OrderedDictionary.prototype.orderedKeys = [];
                    return _.reduce(items, function (result, item) {
                        result[item[itemKey]] = item[itemValue];

                        // set the ordered keys value
                        result.orderedKeys.push(item[itemKey]);
                        return result;
                    }, new OrderedDictionary());
                }

                // If a key is numeric, javascript converts it to a string when using a foreach. This
                // tests if the key is numeric, and if so converts it back.
                scope.convertType = function (item){
                    //if the record is a string type then keep the item as a string
                    if(scope.record && scope.record[scope.field]) {
                        if (typeof scope.record[scope.field] === 'string') {
                            return item.toString();
                        }
                    }

                    //if it's a number - make sure the values are numbers
                    if (item && !isNaN(item)) {
                        return parseInt(item, 10);
                    } else {
                        return item;
                    }
                };

                scope.$watch("items", function(newVal, oldVal){
                    if(scope.items && _.isArray(scope.items)) {
                        if (scope.itemKey && scope.itemValue) {
                            scope.items = convertToHash(scope.items, scope.itemKey, scope.itemValue);
                        }
                    }
                });
            }
        }
    }

    angular.module('sds-angular-controls').directive('formSelect', formSelect);
})();
