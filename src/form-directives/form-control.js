
(function () {
    'use strict';
    function formControl ($timeout) {
        return{
            restrict: 'A',
            require: '^form-field',
            compile: function (tElement, tAttrs){
                tElement.attr('ng-model', 'container.record[container.field]');
                tElement.attr('ng-required', 'container.isRequired');
                tElement.attr('ng-disabled', 'container.isReadonly');
                tElement.attr('name', '{{::container.field}}');
                return function (scope, element, attr, container) {
                    var input = element.find('input');
                    scope.container = container.$scope;

                    if (attr.min){
                        container.$scope.min = attr.min;
                    }
                    if (attr.max){
                        container.$scope.max = attr.max;
                    }
                }
            }
        }
    }

    angular.module('sds-angular-controls').directive('formControl', formControl)

})();
