/**
 * Created by stevegentile on 12/19/14.
 */
(function(){
    "use strict";
    function FormBase($q, $scope, $rootScope, $compile, $timeout){

        $scope.types = InputTypes;
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

        if(!$scope.label){
            $scope.label = $filter("labelCase")($scope.field);
        }

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
    }).factory('formBase', FormBase);
})();
