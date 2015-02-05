/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formInput ($timeout) {
        return{
            restrict: 'E',
            require: '^form-field',
            replace: true,
            scope: {
                placeholder     : '@?',
                rightLabel      : '@?',
                mask            : '@?',
                style           : '@?',
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-input.html',
            link: function (scope, element, attr, container) {
                var input = element.find('input');
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
                if (attr.min){
                    container.$scope.min = scope.$eval(attr.min);
                    input.attr('min', container.$scope.min);
                }
                if (attr.max){
                    container.$scope.max = scope.$eval(attr.max);
                    input.attr('max', container.$scope.max);
                }
                if (attr.pattern){
                    input.attr('pattern', attr.pattern);
                }

                scope.step = attr.step || "any";
                scope.type = attr.type || "text";

                if(scope.type === "integer"){
                    var inputField = element.find(".inputField");
                    $(inputField).on('keyup', function(ev){
                        inputField.val(inputField.val().replace(/[^0-9]/g,''));
                    });
                }
            }
        }
    }

    angular.module('sds-angular-controls').directive('formInput', formInput);
})();
