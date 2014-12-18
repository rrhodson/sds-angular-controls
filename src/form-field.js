(function () {
    'use strict';
    function formField (InputTypes, $filter, $log) {
        return {
            restrict: 'EA',
            templateUrl: 'sds-angular-controls/form-field.html',
            //replace: true,
            scope: {
                record                  : '=',  //two-way binding
                field                   : '@',  //one-way binding
                toggleField             : '@?', //one-way binding
                rightLabel              : '@',  //text to the right of the input box different than the label (ie. hands)
                items                   : '=?', //for select - the array
                placeholder             : '@',
                max                     : '@?',
                min                     : '@',
                type                    : '@',  //text, email, number etc.. see the InputTypes below
                fieldType               : '@', //pass in for special types - ie. 'textarea'  'autonumeric', 'quickdatepicker', 'toggle' 'select' - default is 'input'
                onLabel                 : '@',
                offLabel                : '@',
                toggleSwitchType        : '@', //primary, success, info, danger, warning, inverse default is primary
                mask                    : '@',
                label                   : '@',
                isRequired              : '=?',
                layout                  : '@', //stacked or inline - default is stacked
                labelLayoutCss          : '@', //default col-sm-3
                inputLayoutCss          : '@', //default col-sm-5
                errorLayoutCss          : '@',  //default col-sm-4
                hideValidationMessage   : '=?', //default is false,
                disableTimepicker       : '=?',
                showLabel               : '=?',
                dateFormat              : '@',
                isReadonly                : '=?',  //expects boolean
                style                   : '@?'
            },
            require: '^form', //^parent of our directive, a child form of form above it
            link: function ($scope, element, attr, form) {
                $scope.calender = {opened: false};
                $scope.types = InputTypes;
                $scope.fieldType = $scope.fieldType || "input";
                $scope.isReadonly = $scope.isReadonly || false;
                $scope.layout = $scope.layout || 'stacked';
                $scope.isRequired = $scope.isRequired || false;
                $scope.showLabel = $scope.showLabel || true;
                $scope.hideValidationMessage = $scope.hideValidationMessage || false;
                if($scope.layout === 'inline') {
                    $scope.labelLayoutCss = $scope.labelLayoutCss || "col-md-4";
                    $scope.inputLayoutCss = $scope.inputLayoutCss || "col-md-6";
                    $scope.errorLayoutCss = $scope.errorLayoutCss || "col-md-4";
                }

                //switch
                $scope.toggleSwitchType = $scope.toggleSwitchType || "primary";
                $scope.onLabel = $scope.onLabel   || "Yes";
                $scope.offLabel = $scope.offLabel || "No";

                //quick data picker
                $scope.disableTimepicker = $scope.disableTimepicker || false;
                $scope.dateFormat = $scope.dateFormat || "MM-dd-yyyy";

                if(!$scope.label){
                    $scope.label = $filter("labelCase")($scope.field);
                }
                var inputField = element.find('.inputField');

                $scope.orderHash = function(obj){
                    if (!obj) {
                        return [];
                    }
                    return obj.orderedKeys || Object.keys(obj);
                };


                // If a key is numeric, javascript converts it to a string when using a foreach. This
                // tests if the key is numeric, and if so converts it back.
                $scope.convertType = function (item){
                    //if the record is a string type then keep the item as a string
                    if($scope.record && $scope.record[$scope.field]) {
                        if (typeof $scope.record[$scope.field] === 'string') {
                            return item.toString();
                        }
                    }
                        //if it's a number - make sure the values are numbers
                    if (item && !isNaN(parseInt(item, 10))) {
                        return parseInt(item, 10);
                    } else {
                        return item;
                    }
                };

                function checkIfReadonly(){
                    if($scope.isReadonly) {
                        if ($scope.record && $scope.record[$scope.field]) {

                            if ($scope.fieldType === 'select') {
                                var value = $scope.items[$scope.record[$scope.field]];
                                $scope.readOnlyModel = value;
                            }
                            if ($scope.fieldType === 'toggle') {
                                $scope.readOnlyModel = $scope.record[$scope.field];
                            }

                            if ($scope.fieldType === 'quickdatepicker') {
                                $scope.readOnlyModel = moment($scope.record[$scope.field]).format($scope.dateFormat);
                            }
                        }
                    }
                }

                $scope.$watch("isReadonly", function(newVal, oldVal){
                    if(newVal !== oldVal){
                        checkIfReadonly();
                    }
                });

                $scope.$watch("record", function(newVal, oldVal){
                    if(newVal !== oldVal) {
                        checkIfReadonly();
                    }
                });

                if($scope.mask){
                    inputField.mask($scope.mask);
                }

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.calender.opened = true;
                };

                $scope.showError = function(field){
                    try{
                        if(form.$submitted){
                            return field.$invalid;
                        }else {
                            return field.$dirty && field.$invalid;
                        }
                    }
                    catch(err){
                        return false;
                    }
                };
            }
        };
    }

    angular.module('sds-angular-controls').value('InputTypes', {
        text        : ['Text', 'should be text'],
        email       : ['Email', 'should be an email address'],
        number      : ['Number', 'should be a number'],
        date        : ['Date', 'should be a date'],
        datetime    : ['Datetime', 'should be a datetime'],
        time        : ['Time', 'should be a time'],
        month       : ['Month', 'should be a month'],
        week        : ['Week', 'should be a week'],
        url         : ['URL', 'should be a URL'],
        tel         : ['Phone Number', 'should be a phone number'],
        color       : ['Color', 'should be a color']
    }).directive('formField', formField);
})();
