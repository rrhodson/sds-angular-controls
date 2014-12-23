/**
 * Created by stevegentile on 12/19/14.
 */
/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formField ($filter) {
        return{
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                record                  : '=' , //two-way binding
                isRequired              : '=?',
                isReadonly              : '=?',
                field                   : '@' , //one-way binding
                label                   : '@' ,
                rowClass                : '@?',
                layout                  : '@?',
                labelCss                : '@?', //default col-sm-3
                layoutCss               : '@?',
                errorLayoutCss          : '@?', //default col-sm-4
                hideValidationMessage   : '=?',  //default is false
                validationFieldName       : '@?'  //to override the default label   '[validationFieldName]' is required
            },
            templateUrl: 'sds-angular-controls/form-field.html',
            require: '^form',
            controller: function($scope, $element, $attrs){


                $scope.layout = $scope.layout || "stacked";

                if(!$scope.label){
                    $scope.label = $filter("labelCase")($scope.field);
                }

                $scope.validationFieldName = $scope.validationFieldName || $filter("labelCase")($scope.field);


                $scope.showLabel = $scope.showLabel !== false; // default to true
                $scope.hideValidationMessage = $scope.hideValidationMessage || false;
                $scope.isRequired = $scope.isRequired || false;
                $scope.isReadonly = $scope.isReadonly || false;
                $scope.layoutCss = $scope.layoutCss || "col-md-4";
                $scope.errorLayoutCss = $scope.errorLayoutCss || "col-md-4";

                if($scope.layout === "horizontal"){
                    $scope.labelCss = $scope.labelCss || "col-md-2";
                }

                this.getRecord = function(){
                    return $scope.record;
                };

                this.getField = function() {
                    return $scope.field;
                };

                this.getRequired = function() {
                    return $scope.isRequired;
                };

                this.getLayout = function() {
                    return $scope.layout;
                };

                this.setValue = function(val){
                    $scope.record[$scope.field] = val;
                };

                $scope.showError = function(field){
                    try{
                        var form = $($element).closest("form");
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

                this.setMin = function (min){
                    $scope.min = min;
                };

                this.setMax = function (max){
                    $scope.max = max;
                };

            }
        }
    }

    angular.module('sds-angular-controls').directive('formField', formField);
})();
