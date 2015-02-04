/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formDatePicker ($timeout) {
        return{
            restrict: 'EA',
            require: '^form-field',
            replace: true,
            scope: {
                dateFormat       : '@',
                max              : '=?',
                min              : '=?',
                style            : '@?',
                layoutCss        : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-date-picker.html',

            link: function (scope, element, attr, container) {
                var input = element.find('input');
                scope.container = container.$scope;
                
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
                
                scope.dateFormat = scope.dateFormat || "MM-dd-yyyy";

                scope.calendar = {opened: false};
                scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.calendar.opened = true;
                };

                scope.$watch('container.record[container.field]', function (val){
                    if (typeof val === 'string'){
                        container.$scope.record[container.$scope.field] = moment(container.$scope.record[container.$scope.field]).toDate();
                    }
                });

                scope.$watch("container.isReadonly", function(newVal){
                    if(newVal) {
                        scope.readOnlyModel = moment(scope.container.record[scope.container.field]).format(scope.dateFormat);
                    }
                });

                if (scope.max) {
                    container.$scope.max = moment(scope.max).format(scope.dateFormat);
                }
                if (scope.min) {
                    container.$scope.min = moment(scope.min).format(scope.dateFormat);
                }
            }
        }
    }

    function datepickerPopup (){
        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function(scope, element, attr, controller) {
                //remove the default formatter from the input directive to prevent conflict
                controller.$formatters.shift();
            }
        }
    }

    angular.module('sds-angular-controls').directive('formDatePicker', formDatePicker).directive('datepickerPopup', datepickerPopup);
})();
