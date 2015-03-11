
(function () {
    'use strict';
    function formControl ($timeout,$injector, formControlFormatters) {
        return{
            restrict: 'A',
            //terminal: true,
            //priority: 1000,
            require: ['^formField', 'ngModel', '?select'],
            compile: function (tElement, tAttrs){
                var name = tAttrs.name || tAttrs.ngModel.substr(tAttrs.ngModel.lastIndexOf('.')+1);
                tElement.attr('name', name);
                tElement.attr('ng-required', tAttrs.ngRequired || '{{container.isRequired}}');
                tElement.addClass('form-control');


                return function ($scope, $element, $attrs, containers) {
                    var ngModel = containers[1];
                    var formField = containers[0];
                    var ngOptions = containers[2];
                    $scope.container = formField.$scope;
                    $scope.container.field = name;

                    if ($attrs.min){
                        formField.$scope.min = $attrs.min;
                    }
                    if ($attrs.max){
                        formField.$scope.max = $attrs.max;
                    }
                    if ($attrs.layoutCss && formField.$scope.layout === 'horizontal'){
                        $attrs.$observe('layoutCss', function (val){ formField.$scope.childLayoutCss = val; });
                    }

                    var formatter = _.find(formControlFormatters, function (v, k){ return $element.is(k); });
                    if (!formatter) {
                        formatter = function (ngModel){ return function (){ return ngModel.$modelValue; }};
                    }
                    $scope.container.valueFormatter = $injector.invoke(formatter, this, {ngModel: ngModel, $attrs: $attrs, $scope: $scope});
                }
            }
        }
    }

    var formControlFormatters = {
      'select': function (ngModel, $attrs, $parse, $scope){
          var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
          var match = $attrs.ngOptions.match(NG_OPTIONS_REGEXP);
          var prop = match[5] || match[7];
          var valuesFn = $parse(match[8]);
          var result = $parse(/ as /.test(match[0]) || match[2] ? match[1] : prop);
          var label = $parse(match[2] || match[1]);

          return function (){
              var rec = {};
              rec[prop] = _.find(valuesFn($scope), function (v){
                  var option = {};
                  option[prop] = v;
                  return result($scope, option) === ngModel.$modelValue;
              });
              return label($scope, rec);
          };
      },
      'input[datepicker-popup]': function (ngModel, $attrs){
          return function (){
              return moment.utc(ngModel.$modelValue).format($attrs.datepickerPopup.replace(/d/g, 'D').replace(/E/g, 'd').replace(/y/g, 'Y'));
          };
      }
    };

    angular.module('sds-angular-controls')
        .directive('formControl', formControl)
        .constant('formControlFormatters', formControlFormatters)

})();
