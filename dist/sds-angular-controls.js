/*! sds-angular-controls - v0.0.1 - 2014-12-17
* https://github.com/SMARTDATASYSTEMSLLC/sds-angular-controls
* Copyright (c) 2014 Steve Gentile, David Benson; Licensed  */
angular.module('sds-angular-controls', ['ui.bootstrap', 'toggle-switch']);

(function (){
  'use strict';

  function camelCase (){
    return function (input) {
      return input.toLowerCase().replace(/ (\w)/g, function (match, letter) {
        return letter.toUpperCase();
      });
    };
  }

  angular.module('sds-angular-controls').filter('camelCase', camelCase);
})();

(function () {
    'use strict';
    function formField (InputTypes, $filter, $log) {
        return {
            restrict: 'EA',
            templateUrl: 'sds-angular-controls/formField.html',
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
    formField.$inject = ["InputTypes", "$filter", "$log"];

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

(function (){
  'use strict';

  function labelCase (){
    return function (input) {
      input = input.replace(/([A-Z])/g, ' $1');
      return input[0].toUpperCase() + input.slice(1);
    };
  }

  angular.module('sds-angular-controls').filter('labelCase', labelCase);
})();

angular.module('sds-angular-controls').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('sds-angular-controls/formField.html',
    "<div> <div ng-if=\"layout === 'stacked'\" class=\"form-group clearfix\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <label ng-if=\"showLabel\" class=\"control-label {{labelLayoutCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <div class=\"clearfix\"> <ng-include src=\"'sds-angular-controls/formFieldControls.html'\"></ng-include> </div> <!-- validation --> <div ng-if=\"!hideValidationMessage\" class=\"pull-left has-error\" ng-show=\"showError({{field}})\" ng-messages=\"{{field}}.$error\"> <span class=\"control-label\" ng-message=\"required\"> {{ field | labelCase }} is required. </span> <span class=\"control-label\" ng-message=\"min\"> {{ field | labelCase }} must be at least {{min}}. </span> <span class=\"control-label\" ng-message=\"max\"> {{ field | labelCase }} must not exceed {{max}} </span> <span class=\"control-label\" ng-repeat=\"(k, v) in types\" ng-message=\"{{k}}\"> {{ field | labelCase }}{{v[1]}}</span> </div> </div> <div ng-if=\"layout === 'inline'\" class=\"form-group clearfix\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <label ng-if=\"showLabel\" class=\"control-label {{labelLayoutCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <div class=\"{{inputLayoutCss}}\"> <ng-include src=\"'directive/formField/formFieldControls.html'\"></ng-include> </div> <div ng-if=\"!hideValidationMessage\" ng-show=\"showError({{field}})\" class=\"popover right alert-danger\" style=\"display:inline-block; top:auto; left:auto; margin-top:-6px; min-width:240px\"> <div class=\"arrow\" style=\"top: 50%\"></div> <div class=\"popover-content\" ng-messages=\"{{field}}.$error\"> <div ng-message=\"required\"> {{ field | labelCase }} is required. </div> <div ng-message=\"min\"> {{ field | labelCase }} must be at least {{min}}. </div> <div ng-message=\"max\"> {{ field | labelCase }} must not exceed {{max}} </div> <div ng-repeat=\"(k, v) in types\" ng-message=\"{{k}}\"> {{ field | labelCase }} {{v[1]}}</div> </div> </div> <!----> <!--<div ng-if=\"!hideValidationMessage\" class='{{errorLayoutCss}} has-error'--> <!--ng-show='showError({{field}})' ng-messages='{{field}}.$error'>--> <!--<p class='control-label' ng-message='required'> {{ field | labelCase }} is required. </p>--> <!--<p class='control-label' ng-message='min'> {{ field | labelCase }} must be at least {{min}}. </p>--> <!--<p class='control-label' ng-message='max'> {{ field | labelCase }} must not exceed {{max}} </p>--> <!--<p class='control-label' ng-repeat='(k, v) in types' ng-message='{{k}}'> {{ field | labelCase }}--> <!--{{v[1]}}</p>--> <!--</div>--> </div> <ng-include ng-if=\"layout === 'grid'\" src=\"'directive/formField/formFieldControls.html'\"></ng-include> </div>"
  );


  $templateCache.put('sds-angular-controls/formFieldControls.html',
    "<!-- input --> <div ng-if=\"::fieldType === 'input'\"> <input ng-readonly=\"isReadonly\" style=\"{{::style}}\" class=\"form-control inputField {{::inputLayoutCss}}\" ng-model=\"record[field]\" type=\"{{::type}}\" ng-required=\"isRequired\" max=\"{{::max}}\" min=\"{{::min}}\"> <div ng-if=\"::(rightLabel && rightLabel.length > 0)\" class=\"rightLabel\">{{::rightLabel}}</div> </div> <!-- numeric --> <input ng-if=\"::fieldType === 'autonumeric'\" style=\"{{::style}}\" ng-readonly=\"isReadonly\" type=\"text\" auto-numeric class=\"form-control inputField {{::inputLayoutCss}}\" ng-model=\"record[field]\" max=\"{{::max}}\" min=\"{{::min}}\" ng-required=\"isRequired\"> <!-- textarea --> <textarea ng-if=\"::fieldType == 'textarea'\" ng-readonly=\"isReadonly\" class=\"form-control fullscreen inputField {{::inputLayoutCss}}\" ng-model=\"record[field]\" type=\"{{::type}}\" style=\"{{::style}}\" ng-required=\"isRequired\"></textarea> <!-- toggle --> <div ng-if=\"::fieldType === 'toggle'\"> <toggle-switch style=\"{{::style}}\" class=\"{{::toggleSwitchType}}\" ng-model=\"record[field]\" on-label=\"{{::onLabel}}\" off-label=\"{{::offLabel}}\"> </toggle-switch> <!--<input ng-if=\"isReadonly\" style=\"{{::style}}\" ng-readonly=\"isReadonly\" type='text'--> <!--class=\"form-control inputField {{::inputLayoutCss}}\" ng-model='readOnlyModel'/>--> <div ng-if=\"isReadonly\" class=\"rightLabel\">{{record[field] ? onLabel : offLabel}}</div> </div> <!-- texttoggle --> <div ng-if=\"::fieldType === 'texttoggle'\" class=\"{{::inputLayoutCss}} text-toggle\"> <input type=\"text\" style=\"{{::style}}\" ng-readonly=\"isReadonly\" type=\"{{::type}}\" class=\"form-control inputField\" ng-model=\"record[field]\"> <toggle-switch ng-if=\"!isReadonly\" class=\"{{::toggleSwitchType}}\" ng-model=\"record[toggleField]\" on-label=\"{{::onLabel}}\" off-label=\"{{::offLabel}}\"> </toggle-switch> <div ng-if=\"isReadonly\" class=\"rightLabel\">{{record[field] ? onLabel : offLabel}}</div> </div> <div ng-if=\"::fieldType === 'select'\"> <select ng-if=\"!isReadonly && !hasFilter\" ng-readonly=\"isReadonly\" class=\"form-control\" name=\"{{::field}}\" ng-model=\"record[field]\" ng-options=\"convertType(key) as items[key] for key in orderHash(items)\" ng-required=\"isRequired\"></select> <!-- optionValue as optionLabel for arrayItem in array --> <input ng-if=\"isReadonly\" style=\"{{::style}}\" ng-readonly=\"isReadonly\" type=\"text\" class=\"form-control inputField {{::inputLayoutCss}}\" ng-model=\"readOnlyModel\"> </div> <!-- quickdatapicker --> <span class=\"input-group\" ng-if=\"::fieldType === 'quickdatepicker'\"> <input type=\"text\" style=\"{{::style}}\" class=\"form-control datepicker ng-if=\" isreadonly ng-readonly=\"isReadonly\" placeholder=\"{{placeholder}}\" ng-model=\"record[field]\" ng-required=\"::isRequired\" min-date=\"::min\" max-date=\"::max\" datepicker-popup=\"{{::dateFormat}}\" is-open=\"calender.opened\"> <span ng-if=\"!isReadonly\" class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button> </span> </span>"
  );

}]);
