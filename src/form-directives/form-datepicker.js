/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formDatePicker ($filter, $rootScope) {
        return{
            restrict: 'EA',
            require: '^formField',
            replace: true,
            scope: {
                dateFormat       : '@',
                log              : '@?',
                style            : '@?',
                max              : '@?',
                min              : '@?',
                layoutCss        : '@?', //default col-md-6
                isReadonly       : '=?',  //boolean
                disableTimepicker: '=?'
            },
            templateUrl: 'sds-angular-controls/form-datepicker.html',

            link: function (scope, element, attr, formField) {
                // defaults
                scope.record     = formField.getRecord();
                scope.field      = formField.getField();
                scope.isRequired = formField.getRequired();
                scope.layout     = formField.getLayout();

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




                scope.$watch("record", function(newVal, oldVal){
                    formField.setValue(newVal[scope.field]);
                });
            }
        }
    }

    angular.module('sds-angular-controls').directive('formDatePicker', formDatePicker);
})();
