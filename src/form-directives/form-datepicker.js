/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formDatePicker ($filter, $rootScope) {
        return{
            restrict: 'EA',
            replace: true,
            scope: {
                dateFormat       : '@',
                log              : '@?',
                style            : '@?',
                max              : '=?',
                min              : '=?',
                layoutCss        : '@?', //default col-md-6
                isReadonly       : '=?',  //boolean
                disableTimepicker: '=?'
            },
            templateUrl: 'sds-angular-controls/form-directives/form-datepicker.html',

            link: function (scope, element) {
                var parentScope = element.parent().scope();
                parentScope.$watch('record', function(newVal, oldVal){
                    scope.record = newVal;
                });

                parentScope.$watch('field', function(newVal, oldVal){

                    scope.field = newVal;
                });

                scope.$watch('record[field]', function (val){
                    if (typeof val === 'string'){
                        scope.record[scope.field] = moment(scope.record[scope.field]).toDate();
                    }
                });

                parentScope.$watch('isRequired', function(newVal, oldVal){

                    scope.isRequired = newVal;
                });

                parentScope.$watch('layout', function(newVal, oldVal){

                    scope.layout = newVal;
                });

                parentScope.$watch('isReadonly', function(newVal, oldVal){

                    scope.isReadonly = newVal;
                });

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;

                scope.disableTimepicker = scope.disableTimepicker || false;
                scope.dateFormat = scope.dateFormat || "MM-dd-yyyy";

                scope.calendar = {opened: false};
                scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    scope.calendar.opened = true;
                };

                switch(scope.layout){
                    case "horizontal":
                        scope.layoutCss = scope.layoutCss || "col-md-6";
                        break;
                    default: //stacked
                        scope.layoutCss = scope.layoutCss || "col-md-4";
                }

                function checkIfReadonly(){
                    scope.readOnlyModel = moment(scope.record[scope.field]).format(scope.dateFormat);
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
