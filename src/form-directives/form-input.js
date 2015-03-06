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
                max             : '@?',
                min             : '@?',
                maxlength       : '@?',
                minlength       : '@?',
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
                    $timeout(function (){element.find('input').focus();});
                }
                if (scope.min){
                    container.$scope.min = scope.min;
                }
                if (scope.max){
                    container.$scope.max = scope.max;
                }
                if (attr.pattern){
                    input.attr('pattern', attr.pattern);
                }

                scope.step = attr.step || "any";
                scope.type = attr.type || "text";

                $timeout(function (){
                    var isIntegerStep = scope.step.match(/^\d+$/);
                    if (scope.type === "number"){
                        element.find(".inputField").on('keydown', function (e) {
                            var key = e.which || e.keyCode;

                            return e.metaKey || e.ctrlKey || (!e.shiftKey &&
                                // numbers
                            key >= 48 && key <= 57 ||
                                // Numeric keypad
                            key >= 96 && key <= 105 ||
                                // Minus
                            key == 109 || key == 189 ||
                                // decimal points
                            (!isIntegerStep && key == 190 || key == 110) ||
                                // Backspace and Tab and Enter
                            key == 8 || key == 9 || key == 13 ||
                                // Home and End
                            key == 35 || key == 36 ||
                                // left and right arrows
                            key == 37 || key == 39 ||
                                // Del and Ins
                            key == 46 || key == 45);


                        });
                    }
                });
            }
        }
    }

    angular.module('sds-angular-controls').directive('formInput', formInput)

})();
