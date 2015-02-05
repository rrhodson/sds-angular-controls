/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formNumericInput ($timeout) {
        return{
            restrict: 'EA',
            require: '^form-field',
            replace: true,
            scope: {
                placeholder     : '@?',
                rightLabel      : '@?',
                mask            : '@?',
                style           : '@?',
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-numeric-input.html',
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

                if (container.$scope.min){
                    input.attr('min', container.$scope.min);
                }
                if (container.$scope.max){
                    input.attr('max', container.$scope.max);
                }
                if (container.$scope.isAutofocus){
                    $timeout(input.focus);
                }

                if(scope.type === "integer"){
                    var inputField = element.find(".inputField");
                    $(inputField).on('keyup', function(ev){
                        inputField.val(inputField.val().replace(/[^0-9]/g,''));
                    });
                }
            }
        }
    }

    angular.module('sds-angular-controls').directive('formNumericInput', formNumericInput);
})();
