/**
 * Created by stevegentile on 12/19/14.
 */
/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formField ($filter, $rootScope) {
        return{
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                record                  : '=',  //two-way binding
                isRequired              : '=?',
                isReadonly              : '=?',
                field                   : '@',  //one-way binding
                label                   : '@',
                rowClass                : '@?',
                layout                  : '@?',
                labelLayoutCss          : '@?', //default col-sm-3
                inputLayoutCss          : '@?',
                errorLayoutCss          : '@?',  //default col-sm-4
                hideValidationMessage   : '=?' //default is false,
            },
            templateUrl: 'sds-angular-controls/form-field.html',
            require: '^form',
            controller: function($scope, $element, $attrs){

                $scope.layout = $scope.layout || "stacked";

                if(!$scope.label){
                    $scope.label = $filter("labelCase")($scope.field);
                }

                $scope.showLabel = $scope.showLabel || true;
                $scope.hideValidationMessage = $scope.hideValidationMessage || false;
                $scope.isRequired = $scope.isRequired || false;
                $scope.isReadonly = $scope.isReadonly || false;
                //$scope.labelLayoutCss = $scope.labelLayoutCss || "col-md-4";
                $scope.inputLayoutCss = $scope.inputLayoutCss || "col-md-4";
                $scope.errorLayoutCss = $scope.errorLayoutCss || "col-md-4";

                if($scope.layout === 'inline') {
                    $scope.labelLayoutCss = $scope.labelLayoutCss || "col-md-4";
                    $scope.errorLayoutCss = $scope.errorLayoutCss || "col-md-4";
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
                }

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

                $rootScope.$on('input-min', function(event, args){
                    if($scope.record[args.field]){
                        $scope.min = args.min;
                    }
                });

                $rootScope.$on('input-max', function(event, args){
                    if($scope.record[args.field]){
                        $scope.max = args.max;
                    }
                });


                /*
                 scope.$watch(
                 function(){
                 return parentCtrl.getRadius();
                 },
                 function(newVal){
                 if (newVal){
                 scope.area=2 * scope.pi * newVal
                 }
                 })
                 */
            }
        }
    }

    angular.module('sds-angular-controls').directive('formField', formField);
})();
