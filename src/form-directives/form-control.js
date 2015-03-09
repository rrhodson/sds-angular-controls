
(function () {
    'use strict';
    function formControl ($timeout) {
        return{
            restrict: 'A',
            terminal: true,
            priority: 1000,
            require: '^form-field, ngModel',
            compile: function (tElement, tAttrs){
                var name = tAttrs.name || tAttrs.ngModel.substr(tAttrs.ngModel.lastIndexOf('.')+1);
                tElement.attr('name', name);
                tElement.attr('ng-required', tAttrs.ngRequired || '{{container.isRequired}}');


                return function (scope, element, attr, containers) {
                    var ngModel = containers[1];
                    var formField = containers[0];
                    scope.container = formField.$scope;
                    scope.container.field = name;

                    if (attr.min){
                        formField.$scope.min = attr.min;
                    }
                    if (attr.max){
                        formField.$scope.max = attr.max;
                    }
                    if (attr.layoutCss && formField.$scope.layout === 'horizontal'){
                        attr.$observe('layoutCss', function (val){ formField.$scope.childLayoutCss = val; });
                    }

                    //formField.setValueFormatter()


                }
            }
        }
    }

    angular.module('sds-angular-controls').directive('formControl', formControl)

})();
