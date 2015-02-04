/**
 * Created by stevegentile on 12/19/14.
 */
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
                itemGroupKey    : '@?',
                itemGroupValue  : '@?',
                allowCustom     : '=?',
                style           : '@?',
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-autocomplete.html',

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
                    $timeout(input.focus);
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
