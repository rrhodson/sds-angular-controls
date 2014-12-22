/*! sds-angular-controls - v0.1.4 - 2014-12-22
* https://github.com/SMARTDATASYSTEMSLLC/sds-angular-controls
* Copyright (c) 2014 Steve Gentile, David Benson; Licensed  */
angular.module('sds-angular-controls', ['ui.bootstrap', 'toggle-switch', 'ngSanitize']);

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

(function (){
    'use strict';

    function complexFilter ($filter){
        return function(input,arg) {
            if (typeof arg === "string"){
                return $filter('filter')(input, arg);

            }else {
                var prop = function (obj, key){
                    var arr = key.split(".");
                    while(arr.length && (obj = obj[arr.shift()])); // jshint ignore:line
                    return obj;
                };


                var filters = [];
                // setup filters
                _.each(arg, function (col) {
                    if (col.type === 'date' && col.filter) {
                        var d = col.filter.split("-");
                        var d1 = moment(d[0]);
                        var d2 = moment(d[1] || d1.clone().endOf('day'));
                        if (d1.isValid() && d2.isValid()) {
                            filters.push({
                                filter: [d1.valueOf(), d2.valueOf()],
                                key: col.key,
                                type: col.type
                            });
                        }
                    } else if (col.type === 'number' && col.filter) {
                        var n = col.filter.split("-");
                        if(!n[0] && n[1]){
                            n.slice(0,1);
                            n[0] *= -1;
                        }
                        if(!n[1] && n[2]){
                            n.slice(1,1);
                            n[1] *= -1;
                        }
                        var n1 = parseFloat(n[0]);
                        var n2 = parseFloat(n[1] || n[0]);
                        filters.push({
                            filter:[n1, n2],
                            key: col.key,
                            type:col.type
                        });
                    }else if (typeof col.filter === 'string'){
                        filters.push({
                            filter:col.filter.toLowerCase(),
                            key: col.key
                        });
                    }
                });

                // run query
                return _.filter(input, function (item) {
                    return _.all(filters, function (col) {
                        if (!col.filter || !col.key) {
                            return true;
                        } else if (!col.type) {
                            return (prop(item,col.key) + "").toLowerCase().indexOf(col.filter) > -1;
                        } else if (col.type === 'date') {
                            var d = moment(prop(item,col.key)).valueOf();
                            return d >= col.filter[0] && d <= col.filter[1];
                        } else if (col.type === 'number') {
                            return prop(item,col.key) >= col.filter[0] && prop(item,col.key) <= col.filter[1];
                        }
                    });
                });
            }


        };
    }
    complexFilter.$inject = ["$filter"];

    angular.module('sds-angular-controls').filter('complexFilter', complexFilter);
})();

(function (){
    'use strict';

    function keyFilter (){
        return function (obj, query) {
            var result = {};
            angular.forEach(obj, function (val, key) {
                if (key !== query) {
                    result[key] = val;
                }
            });
            return result;
        };
    }

    angular.module('sds-angular-controls').filter('keyFilter', keyFilter);
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

(function (){
    'use strict';

    function ordinal (){
        var suffixes = ["th", "st", "nd", "rd"];
        return function(input) {
            var v=input%100;
            return input+(suffixes[(v-20)%10]||suffixes[v]||suffixes[0]);
        };
    }

    angular.module('sds-angular-controls').filter('ordinal', ordinal);
})();

(function (){
    'use strict';

    function page (){
        return function(input, page, size) {
            if (!input || !input.length){
                return [];
            }

            page = parseInt(page || 0, 10) || 0;
            size = parseInt(size || 0, 10);
            if (!size){
                size = 25;
            }
            return input.slice(page * size, (page+1) * size);
        };
    }

    angular.module('sds-angular-controls').filter('page', page);
})();

(function (){
    'use strict';

    function unsafe ($sce) { return $sce.trustAsHtml; }
    unsafe.$inject = ["$sce"];

    angular.module('sds-angular-controls').filter('unsafe', unsafe);
})();


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
    formDatePicker.$inject = ["$filter", "$rootScope"];

    angular.module('sds-angular-controls').directive('formDatePicker', formDatePicker);
})();

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
                hideValidationMessage   : '=?'  //default is false
            },
            templateUrl: 'sds-angular-controls/form-field.html',
            require: '^form',
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){


                $scope.layout = $scope.layout || "stacked";

                if(!$scope.label){
                    $scope.label = $filter("labelCase")($scope.field);
                }


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

            }]
        }
    }
    formField.$inject = ["$filter"];

    angular.module('sds-angular-controls').directive('formField', formField);
})();

(function () {
    'use strict';
    function formInput ($filter, $rootScope) {
        return{
            restrict: 'EA',
            require: '^formField',
            replace: true,
            scope: {
                log             : '@?',
                placeholder     : '@?',
                mask            : '@?', //todo
                style           : '@?',
                max             : '@?',
                min             : '@?',
                type            : '@',  //text, email, number etc.. see the InputTypes
                layoutCss       : '@?', //default col-md-6
                isReadonly      : '=?',  //boolean
                isNumeric       : '=?'
            },
            templateUrl: 'sds-angular-controls/form-input.html',

            link: function (scope, element, attr, formField) {
                // defaults
                scope.record     = formField.getRecord();
                scope.field      = formField.getField();
                scope.isRequired = formField.getRequired();
                scope.layout     = formField.getLayout();

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;
                scope.type = scope.type || "text";

                if(scope.isNumeric){
                    $(element).prop("auto-numeric", true);
                }

                if(scope.min) {
                    formField.setMin(scope.min);
                }

                if(scope.max) {
                    formField.setMax(scope.max);
                }

                switch(scope.layout){
                    case "horizontal":
                        scope.layoutCss = scope.layoutCss || "col-md-6";
                        break;
                    default: //stacked
                        scope.layoutCss = scope.layoutCss || "col-md-4";
                }

                scope.placeholder = scope.placeholder ||  $filter("labelCase")(scope.field);

                scope.$watch("record", function(newVal, oldVal){
                    formField.setValue(newVal[scope.field]);
                });
            }
        }
    }
    formInput.$inject = ["$filter", "$rootScope"];

    angular.module('sds-angular-controls').directive('formInput', formInput);
})();

(function () {
    'use strict';
    function formSelect ($filter, $rootScope) {
        return{
            restrict: 'EA',
            require: '^formField',
            replace: true,
            scope: {
                items           : '=',
                itemKey         : '@?',
                itemValue       : '@?',
                log             : '@?',
                style           : '@?',
                layoutCss       : '@?', //default col-md-6
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-select.html',

            link: function (scope, element, attr, formField) {
                // defaults
                scope.record     = formField.getRecord();
                scope.field      = formField.getField();
                scope.isRequired = formField.getRequired();
                scope.layout     = formField.getLayout();

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;


                switch(scope.layout){
                    case "horizontal":
                        scope.layoutCss = scope.layoutCss || "col-md-6";
                        break;
                    default: //stacked
                        scope.layoutCss = scope.layoutCss || "col-md-4";
                }

                scope.orderHash = function(obj){
                    if (!obj) {
                        return [];
                    }
                    return obj.orderedKeys || Object.keys(obj);
                };

                function convertToHash(items, itemKey, itemValue){
                    var OrderedDictionary = function (){};
                    OrderedDictionary.prototype.orderedKeys = [];
                    return _.reduce(items, function (result, item) {
                        result[item[itemKey]] = item[itemValue];

                        // set the ordered keys value
                        result.orderedKeys.push(item[itemKey]);
                        return result;
                    }, new OrderedDictionary());
                }

                function checkIfReadonly(){
                    if(scope.isReadonly) {
                        if (scope.record && scope.record[scope.field]) {

                            var value = scope.items[scope.record[scope.field]];
                            scope.readOnlyModel = value;
                        }
                    }
                }

                // If a key is numeric, javascript converts it to a string when using a foreach. This
                // tests if the key is numeric, and if so converts it back.
                scope.convertType = function (item){
                    //if the record is a string type then keep the item as a string
                    if(scope.record && scope.record[scope.field]) {
                        if (typeof scope.record[scope.field] === 'string') {
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

                scope.$watch("items", function(newVal, oldVal){
                    if(scope.items && _.isArray(scope.items)) {
                        if (scope.itemKey && scope.itemValue) {
                            scope.items = convertToHash(scope.items, scope.itemKey, scope.itemValue);
                        }
                    }
                });


                scope.$watch("record", function(newVal, oldVal){
                    formField.setValue(newVal[scope.field]);
                });
            }
        }
    }
    formSelect.$inject = ["$filter", "$rootScope"];

    angular.module('sds-angular-controls').directive('formSelect', formSelect);
})();


(function () {
  'use strict';
  function maskInput (){
    return {
      restrict: 'A',
      scope:{
        maskInput: '@'
      },
      link: function (scope, element) {
        if(scope.maskInput) {
          $(element).mask(scope.maskInput);
        }
      }
    };
  }

  angular.module('sds-angular-controls').directive('maskInput', maskInput);
})();

(function (){
    'use strict';

    function phoneNumber (){
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country === 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return (country + " (" + city + ") " + number).trim();
        };
    }

    angular.module('sds-angular-controls').filter('phoneNumber', phoneNumber);
})();

angular.module('sds-angular-controls').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('sds-angular-controls/form-directives/form-datepicker.html',
    "<span class=\"input-group\"> <input type=\"text\" style=\"{{::style}}\" class=\"form-control datepicker\" ng-if=\"!isReadonly\" ng-readonly=\"isReadonly\" placeholder=\"{{placeholder}}\" ng-model=\"record[field]\" ng-required=\"::isRequired\" min-date=\"::min\" max-date=\"::max\" datepicker-popup=\"{{::dateFormat}}\" is-open=\"calendar.opened\"> <span ng-if=\"!isReadonly\" class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button> </span> </span>"
  );


  $templateCache.put('sds-angular-controls/form-directives/form-field.html',
    "<div class=\"row\"> <script type=\"text/ng-template\" id=\"validation.html\"><div ng-if=\"!hideValidationMessage\" class='has-error' ng-show='showError({{field}})'\n" +
    "             ng-messages='{{field}}.$error'>\n" +
    "            <span class='control-label' ng-message='required'> {{ field | labelCase }} is required. </span>\n" +
    "            <span class='control-label' ng-message='text'> {{ field | labelCase }} should be text. </span>\n" +
    "            <span class='control-label' ng-message='email'> {{ field | labelCase }} should be an email address. </span>\n" +
    "            <span class='control-label' ng-message='date'> {{ field | labelCase }} should be a date. </span>\n" +
    "            <span class='control-label' ng-message='datetime'> {{ field | labelCase }} should be a datetime. </span>\n" +
    "            <span class='control-label' ng-message='time'> {{ field | labelCase }} should be a time. </span>\n" +
    "            <span class='control-label' ng-message='month'> {{ field | labelCase }} should be a month. </span>\n" +
    "            <span class='control-label' ng-message='week'> {{ field | labelCase }} should be a week. </span>\n" +
    "            <span class='control-label' ng-message='url'> {{ field | labelCase }} should be an url. </span>\n" +
    "            <span class='control-label' ng-message='zip'> {{ field | labelCase }} should be a valid zipcode. </span>\n" +
    "            <span class='control-label' ng-message='number'>{{ field | labelCase }} must be a number</span>\n" +
    "            <span class='control-label' ng-message='tel'>{{ field | labelCase }} must be a phone number</span>\n" +
    "            <span class='control-label' ng-message='color'>{{ field | labelCase }} must be a color</span>\n" +
    "            <span class='control-label' ng-message='min'> {{ field | labelCase }} must be at least {{min}}. </span>\n" +
    "            <span class='control-label' ng-message='max'> {{ field | labelCase }} must not exceed {{max}} </span>\n" +
    "            <span class='control-label' ng-repeat='(k, v) in types' ng-message='{{k}}'> {{ field | labelCase }}{{v[1]}}</span>\n" +
    "        </div></script> <div ng-if=\"layout === 'stacked'\" class=\"form-group clearfix\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <div class=\"{{::layoutCss}}\"> <label ng-if=\"showLabel\" class=\"control-label {{labelCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <!--<div class=\"clearfix\">--> <div ng-transclude></div> <!--</div>--> <!-- validation --> <div class=\"pull-left\" ng-include=\"'validation.html'\"></div> </div> </div> <div ng-if=\"layout === 'horizontal'\" class=\"form-group\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <label ng-if=\"showLabel\" class=\"control-label {{labelCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <!--<div class=\"clearfix\">--> <div ng-transclude></div> <!--</div>--> <!-- validation --> <div class=\"pull-right\" ng-include=\"'validation.html'\"></div> </div> </div>"
  );


  $templateCache.put('sds-angular-controls/form-directives/form-input.html',
    "<div> <div ng-if=\"layout === 'horizontal'\" class=\"{{::layoutCss}}\"> <input class=\"form-control inputField\" ng-model=\"record[field]\" type=\"{{::type}}\" ng-required=\"isRequired\" ng-disabled=\"isReadonly\" placeholder=\"{{::placeholder}}\" max=\"{{::max}}\" min=\"{{::min}}\" style=\"{{::style}}\" mask-input=\"{{::mask}}\"> </div> <div ng-if=\"layout === 'stacked'\"> <input class=\"form-control inputField {{::layoutCss}}\" ng-model=\"record[field]\" type=\"{{::type}}\" ng-required=\"isRequired\" ng-disabled=\"isReadonly\" placeholder=\"{{::placeholder}}\" max=\"{{::max}}\" min=\"{{::min}}\" style=\"{{::style}}\" mask-input=\"{{::mask}}\"> </div> <div ng-if=\"log\"> form-input value: {{record[field]}}<br> {{isRequired}} </div> </div>"
  );


  $templateCache.put('sds-angular-controls/form-directives/form-select.html',
    "<div> <select ng-if=\"!isReadonly && !hasFilter\" ng-readonly=\"isReadonly\" class=\"form-control\" name=\"{{::field}}\" ng-model=\"record[field]\" ng-options=\"convertType(key) as items[key] for key in orderHash(items)\" ng-required=\"isRequired\"></select> <!-- optionValue as optionLabel for arrayItem in array --> <input ng-if=\"isReadonly\" style=\"{{::style}}\" ng-readonly=\"isReadonly\" type=\"text\" class=\"form-control inputField {{::inputLayoutCss}}\" ng-model=\"readOnlyModel\"> <div ng-if=\"log\"> form-input value: {{record[field]}}<br> {{isRequired}} </div> </div>"
  );

}]);
