/*! sds-angular-controls - v0.1.4 - 2015-01-04
* https://github.com/SMARTDATASYSTEMSLLC/sds-angular-controls
* Copyright (c) 2015 Steve Gentile, David Benson; Licensed  */
angular.module('sds-angular-controls', ['ui.bootstrap', 'toggle-switch', 'ngSanitize']);

(function () {
    'use strict';
    function autoNumeric (){
        var options = {};
        return {
            require: '?ngModel', // Require ng-model in the element attribute for watching changes.
            restrict: 'A',
            compile: function (tElm, tAttrs) {
                //ref: https://gist.github.com/kwokhou/5964296
                //autonumeric: https://github.com/BobKnothe/autoNumeric

                var isTextInput = tElm.is('input:text');

                return function (scope, elm, attrs, controller) {
                    // Get instance-specific options.
                    var opts = angular.extend({}, options, scope.$eval(attrs.autoNumeric));

                    // Helper method to update autoNumeric with new value.
                    var updateElement = function (element, newVal) {
                        // Only set value if value is numeric
                        if ($.isNumeric(newVal)) {
                            element.autoNumeric('set', newVal);
                        }
                    };

                    // Initialize element as autoNumeric with options.
                    elm.autoNumeric(opts);

                    // if element has controller, wire it (only for <input type="text" />)
                    if (controller && isTextInput) {
                        // watch for external changes to model and re-render element
                        scope.$watch(tAttrs.ngModel, function (current, old) {
                            controller.$render();
                        });
                        // render element as autoNumeric
                        controller.$render = function () {
                            updateElement(elm, controller.$viewValue);
                        };
                        // Detect changes on element and update model.
                        elm.on('change', function (e) {
                            scope.$apply(function () {
                                controller.$setViewValue(elm.autoNumeric('get'));
                            });
                        });
                    }
                    else {
                        // Listen for changes to value changes and re-render element.
                        // Useful when binding to a readonly input field.
                        if (isTextInput) {
                            attrs.$observe('value', function (val) {
                                updateElement(elm, val);
                            });
                        }
                    }
                };
            } // compile
        };
    }

    angular.module('sds-angular-controls').directive('autoNumeric',autoNumeric);
})();

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
            templateUrl: 'sds-angular-controls/form-directives/form-datepicker.html',

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
                hideValidationMessage   : '=?',  //default is false
                validationFieldName       : '@?'  //to override the default label   '[validationFieldName]' is required
            },
            templateUrl: 'sds-angular-controls/form-directives/form-field.html',
            require: '^form',
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){


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

            }]
        }
    }
    formField.$inject = ["$filter"];

    angular.module('sds-angular-controls').directive('formField', formField);
})();

(function () {
    'use strict';
    function formInput ($filter) {
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
            templateUrl: 'sds-angular-controls/form-directives/form-input.html',
            link: function (scope, element, attr, formField) {
                // defaults
                scope.record     = formField.getRecord();
                scope.field      = formField.getField();
                scope.isRequired = formField.getRequired();
                scope.layout     = formField.getLayout();

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;
                scope.type = scope.type || "text";


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

                scope.$watch("isReadonly", function(newVal, oldVal){
                    if(newVal !== oldVal){
                        checkIfReadonly();
                    }
                });

                scope.$watch("record", function(newVal, oldVal){
                    formField.setValue(newVal[scope.field]);
                    checkIfReadonly();
                });

                function checkIfReadonly(){
                    if(scope.isReadonly) {
                        if (scope.fieldType === 'toggle') {
                            scope.readOnlyModel = scope.record[scope.field];
                        }
                    }
                }
            }
        }
    }
    formInput.$inject = ["$filter"];

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
            templateUrl: 'sds-angular-controls/form-directives/form-select.html',

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
    function formToggle ($filter) {
        return{
            restrict: 'EA',
            require: '^formField',
            replace: true,
            scope: {
                log             : '@?',
                placeholder     : '@?',
                toggleField     : '@?', //one-way binding
                toggleSwitchType: '@?',
                onLabel         : '@?',
                offLabel        : '@?',
                style           : '@?',
                type            : '@',  //text, email, number etc.. see the InputTypes
                layoutCss       : '@?', //default col-md-6
                isReadonly      : '=?'  //boolean
            },
            templateUrl: 'sds-angular-controls/form-toggle.html',
            link: function (scope, element, attr, formField) {
                // defaults
                scope.record     = formField.getRecord();
                scope.field      = formField.getField();
                scope.isRequired = formField.getRequired();
                scope.layout     = formField.getLayout();

                scope.isReadonly = scope.isReadonly || false;

                scope.log = scope.log || false;
                scope.type = scope.type || "text";

                scope.toggleSwitchType = scope.toggleSwitchType || "primary";
                scope.onLabel = scope.onLabel   || "Yes";
                scope.offLabel = scope.offLabel || "No";


                switch(scope.layout){
                    case "horizontal":
                        scope.layoutCss = scope.layoutCss || "col-md-6";
                        break;
                    default: //stacked
                        scope.layoutCss = scope.layoutCss || "col-md-4";
                }

                scope.$watch("isReadonly", function(newVal, oldVal){
                    if(newVal !== oldVal){
                        checkIfReadonly();
                    }
                });

                scope.$watch("record", function(newVal, oldVal){
                    formField.setValue(newVal[scope.field]);
                    checkIfReadonly();
                });

                function checkIfReadonly(){
                    if(scope.isReadonly) {
                        if (scope.fieldType === 'toggle') {
                            scope.readOnlyModel = scope.record[scope.field];
                        }
                    }
                }
            }
        }
    }
    formToggle.$inject = ["$filter"];

    angular.module('sds-angular-controls').directive('formToggle', formToggle);
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


(function () {
    'use strict';

    // for internal use only

    function fancyBindCell ($compile) {
        return{
            restrict: 'A',
            link: function (scope, element, attr) {
                if (typeof scope.col.template === 'function'){
                    element.append(scope.col.template(scope));
                }else{
                    var html = angular.element('<span>' + scope.col.template  + '</span>');
                    var compiled = $compile(html) ;
                    element.append(html);
                    compiled(scope);
                    element.data('compiled', compiled);
                    scope.$watch('row', function (val, old){
                        element.data('compiled')(scope);
                    });
                }
            }
        }
    }
    fancyBindCell.$inject = ["$compile"];

    angular.module('sds-angular-controls').directive('fancyBindCell', fancyBindCell);
})();


(function () {
    'use strict';
    function fancyColumn ($interpolate) {
        return{
            restrict: 'E',
            require: '^fancyGrid',
            compile:function(tElement){
                var templateText = tElement.html();
                tElement.empty();

                return function (scope, element, attr, fancyGrid) {
                    var templateFunc = null;
                    if (!templateText && attr.key){
                        console.log(scope);
                        templateText = '{{' + scope.$parent.rowName + '.' + attr.key + '}}'
                    }

                    if (attr.bind === 'true'){
                        templateFunc = templateText;
                    }else{
                        templateFunc = $interpolate(templateText);
                    }

                    fancyGrid.addColumn({
                        key: attr.key,
                        label: attr.label,
                        sortable: attr.sortable,
                        type: attr.type,
                        bind: attr.bind === 'true',
                        template: templateFunc
                    });
                }
            }
        }
    }
    fancyColumn.$inject = ["$interpolate"];

    angular.module('sds-angular-controls').directive('fancyColumn', fancyColumn);
})();

(function () {
    'use strict';
    function fancyGrid ($compile, $timeout, $filter) {
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            scope: {
                //items: '=',
                label: '@',
                hideAdvanced: '@',
                layoutCss: '@',
                pageSize: '@'
            },
            templateUrl: 'sds-angular-controls/table-directives/fancy-grid.html',
            compile: function (tElement, tAttrs){
                var loop = tAttrs.for.split(' ');
                if (loop.length !== 1 && loop[1] != 'in') {
                    console.error('Invalid loop');
                    return;
                }

                tElement.find('tbody > tr').attr('ng-repeat',
                    loop[0] + ' in model.resultCount = model.getItems(' +
                    'model.showAdvanced ? cols : model.filterText,' +
                    'cols[model.sort].key,' +
                    'model.sortAsc,' +
                    'model.currentPage - 1,' +
                    'model.pageSize)');

            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs){
                var filter = $filter('complexFilter');
                var orderBy = $filter('orderBy');
                var page = $filter('page');

                var loop = $attrs.for.split(' ');
                $scope.rowName = loop[0];

                $scope.model = {
                    items: [],
                    cols: [],
                    getItems: function (filter, sortKey, sortAsc, page, pageSize){
                        //return page(orderBy(filter($scope.items, filter), sortKey, sortAsc), page, pageSize);
                        return $scope.model.items;
                    },
                    sortAsc: false,
                    sort: null
                };

                if (loop[2]) {
                    $element.parent().scope().$watch(loop[2], function (items) {
                        $scope.model.items = items;
                    });
                }

                this.addColumn = function (item){
                    console.log('Added Column', item);
                    // {template: func, key: string, has-bind: bool}
                    $scope.model.cols.push(item);
                };
                this.setDataSource = function (dataSource){
                    $scope.model.getItems = dataSource;
                };
            }]
            //link: function ($scope, element, attrs, fn) {
                //scope.vm = {
                //    sortAsc: false,
                //    sort: _.findIndex(scope.cols, {sortable:true}),
                //    currentPage: 1,
                //    pageSize: scope.pageSize ? scope.pageSize : 25,
                //    showAdvanced: false,
                //    filterText: '',
                //    toggleSort: toggleSort,
                //    // if a callback is specified, and the user clicked on an anchor link or button, call the callback
                //    onClick: onClick,
                //    onEnter: onEnter,
                //    clearFilters: clearFilters,
                //    extend: function (col){
                //        return _.extend({}, element.parent().scope(), col);
                //    }
                //};
                //
                //function toggleSort(index){
                //    if (scope.vm.sort === index)  {
                //        scope.vm.sortAsc = ! scope.vm.sortAsc;
                //    }else{
                //        scope.vm.sort = index;
                //    }
                //}
                //function onEnter(){
                //    console.log('enter');
                //    if (scope.vm.resultCount.length === 1){
                //        $timeout(function (){
                //            element.find('tbody tr a:first').click();
                //        });
                //    }
                //
                //}
                //
                //function onClick(e, col, row){
                //    if (angular.element(e.target).is('a, button, input[type=button]')) {
                //        e.preventDefault();
                //        col.callback(row);
                //    }
                //}
                //function clearFilters(){
                //    _.each(scope.cols, function (item){
                //       item.filter = '';
                //    });
                //}
                //
                //if (!scope.cols) {
                //    return;
                //}
                //
                //// generate template rows
                //var templateDefault = '';
                //// Add in templates per row
                //for(var i = 0; i < scope.cols.length; i++){
                //    // while the template is currently passed in through the cols array,
                //    // I would like to eventually pull these from a child directive of the grid
                //    if (typeof scope.cols[i].template !== 'function') {
                //        if (scope.cols[i].template) {
                //            templateDefault = scope.cols[i].template;
                //        }else if (scope.cols[i].key) {
                //            templateDefault = '{{' + scope.cols[i].key + '}}';
                //        } else {
                //            templateDefault = '';
                //        }
                //
                //        // interpolate is angular's built in template generator.
                //        // we are creating a function that can be used to fill templates in the view
                //        scope.cols[i].template = $interpolate(templateDefault);
                //    }
                //}

            //}
        };
    }
    fancyGrid.$inject = ["$compile", "$timeout", "$filter"];

    angular.module('sds-angular-controls').directive('fancyGrid', fancyGrid);

})();

angular.module('sds-angular-controls').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('sds-angular-controls/form-directives/form-datepicker.html',
    "<span class=\"input-group\"> <input type=\"text\" style=\"{{::style}}\" class=\"form-control datepicker\" ng-if=\"!isReadonly\" ng-readonly=\"isReadonly\" placeholder=\"{{placeholder}}\" ng-model=\"record[field]\" ng-required=\"::isRequired\" min-date=\"::min\" max-date=\"::max\" datepicker-popup=\"{{::dateFormat}}\" is-open=\"calendar.opened\"> <span ng-if=\"!isReadonly\" class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button> </span> </span>"
  );


  $templateCache.put('sds-angular-controls/form-directives/form-field.html',
    "<div class=\"row\"> <script type=\"text/ng-template\" id=\"validation.html\"><div ng-if=\"!hideValidationMessage\" class='has-error' ng-show='showError({{field}})'\n" +
    "             ng-messages='{{field}}.$error'>\n" +
    "            <span class='control-label' ng-message='required'> {{ validationFieldName }} is required. </span>\n" +
    "            <span class='control-label' ng-message='text'> {{ validationFieldName }} should be text. </span>\n" +
    "            <span class='control-label' ng-message='email'> {{ validationFieldName }} should be an email address. </span>\n" +
    "            <span class='control-label' ng-message='date'> {{ validationFieldName}} should be a date. </span>\n" +
    "            <span class='control-label' ng-message='datetime'> {{ validationFieldName }} should be a datetime. </span>\n" +
    "            <span class='control-label' ng-message='time'> {{ validationFieldName }} should be a time. </span>\n" +
    "            <span class='control-label' ng-message='month'> {{ validationFieldName }} should be a month. </span>\n" +
    "            <span class='control-label' ng-message='week'> {{ validationFieldName }} should be a week. </span>\n" +
    "            <span class='control-label' ng-message='url'> {{ validationFieldName }} should be an url. </span>\n" +
    "            <span class='control-label' ng-message='zip'> {{ validationFieldName }} should be a valid zipcode. </span>\n" +
    "            <span class='control-label' ng-message='number'>{{ validationFieldName }} must be a number</span>\n" +
    "            <span class='control-label' ng-message='tel'>{{ validationFieldName }} must be a phone number</span>\n" +
    "            <span class='control-label' ng-message='color'>{{ validationFieldName }} must be a color</span>\n" +
    "            <span class='control-label' ng-message='min'> {{ validationFieldName }} must be at least {{min}}. </span>\n" +
    "            <span class='control-label' ng-message='max'> {{ validationFieldName }} must not exceed {{max}} </span>\n" +
    "            <span class='control-label' ng-repeat='(k, v) in types' ng-message='{{k}}'> {{ validationFieldName }}{{v[1]}}</span>\n" +
    "        </div></script> <div ng-if=\"layout === 'stacked'\" class=\"form-group clearfix\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <div class=\"{{::layoutCss}}\"> <label ng-if=\"showLabel\" class=\"control-label {{labelCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <!--<div class=\"clearfix\">--> <div ng-transclude></div> <!--</div>--> <!-- validation --> <div class=\"pull-left\" ng-include=\"'validation.html'\"></div> </div> </div> <div ng-if=\"layout === 'horizontal'\" class=\"form-group\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <label ng-if=\"showLabel\" class=\"control-label {{labelCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <!--<div class=\"clearfix\">--> <div ng-transclude></div> <!--</div>--> <!-- validation --> <div class=\"pull-right\" ng-include=\"'validation.html'\"></div> </div> </div>"
  );


  $templateCache.put('sds-angular-controls/form-directives/form-input.html',
    "<div> <div class=\"{{layout === 'horizontal' ? layoutCss : '' }}\"> <input ng-if=\"!isNumeric\" class=\"form-control inputField {{layout === 'stacked' ? layoutCss : ''}}\" ng-model=\"record[field]\" type=\"{{::type}}\" ng-required=\"isRequired\" ng-disabled=\"isReadonly\" placeholder=\"{{::placeholder}}\" max=\"{{::max}}\" min=\"{{::min}}\" style=\"{{::style}}\" mask-input=\"{{::mask}}\"> <input ng-if=\"isNumeric\" class=\"form-control inputField {{layout === 'stacked' ? layoutCss : ''}}\" ng-model=\"record[field]\" type=\"{{::type}}\" ng-required=\"isRequired\" ng-disabled=\"isReadonly\" placeholder=\"{{::placeholder}}\" max=\"{{::max}}\" min=\"{{::min}}\" style=\"{{::style}}\" mask-input=\"{{::mask}}\" auto-numeric> <div ng-if=\"log\"> form-input value: {{record[field]}}<br> {{isRequired}} </div> </div> </div>"
  );


  $templateCache.put('sds-angular-controls/form-directives/form-select.html',
    "<div> <select ng-if=\"!isReadonly && !hasFilter\" ng-readonly=\"isReadonly\" class=\"form-control\" name=\"{{::field}}\" ng-model=\"record[field]\" ng-options=\"convertType(key) as items[key] for key in orderHash(items)\" ng-required=\"isRequired\"></select> <!-- optionValue as optionLabel for arrayItem in array --> <input ng-if=\"isReadonly\" style=\"{{::style}}\" ng-readonly=\"isReadonly\" type=\"text\" class=\"form-control inputField {{::inputLayoutCss}}\" ng-model=\"readOnlyModel\"> <div ng-if=\"log\"> form-input value: {{record[field]}}<br> {{isRequired}} </div> </div>"
  );


  $templateCache.put('sds-angular-controls/form-toggle.html',
    "<div> <!-- bug in toggle where setting any disabled makes it disabled - so needing an if here --> <toggle-switch ng-if=\"isReadonly\" style=\"{{::style}}\" disabled class=\"{{::toggleSwitchType}}\" ng-model=\"record[field]\" on-label=\"{{::onLabel}}\" off-label=\"{{::offLabel}}\"> </toggle-switch> <toggle-switch ng-if=\"!isReadonly\" style=\"{{::style}}\" class=\"{{::toggleSwitchType}}\" ng-model=\"record[field]\" on-label=\"{{::onLabel}}\" off-label=\"{{::offLabel}}\"> </toggle-switch> <div ng-if=\"log\"> form-input value: {{record[field]}}<br> {{isRequired}} </div> </div>"
  );


  $templateCache.put('sds-angular-controls/table-directives/fancy-grid.html',
    "<div class=\"table-responsive\"> <!--<div class=\"btn-toolbar\">--> <!--<a ng-if=\"model.showAdvanced\" href=\"\" class=\"btn btn-default\" ng-click=\"model.clearFilters()\">Clear All Filters <span class=\"big-x\">&times;</span></a>--> <!--<div ng-if=\"!model.showAdvanced\" class=\"toolbar-input\">--> <!--<div class=\"form-group has-feedback\">--> <!--<input class=\"form-control\" type=\"text\" ng-model=\"model.filterText\"--> <!--placeholder=\"Filter {{label || 'items'}}\" on-enter=\"model.onEnter()\" />--> <!--<a href=\"\" ng-click=\"model.filterText = ''\" class=\"form-control-feedback feedback-link\">&times;</a>--> <!--</div>--> <!--</div>--> <!--<a href=\"\" ng-if=\"!hideAdvanced\" class=\"btn btn-default\"  ng-class=\"{active: model.showAdvanced}\" ng-click=\"model.showAdvanced = !model.showAdvanced\">Advanced Filtering</a>--> <ng-transclude></ng-transclude> <!--<p ng-show=\"data\"><i>{{model.resultCount.length}} {{label || 'items'}}</i></p>--> <!--</div>--> <table class=\"table table-hover {{className}}\"> <thead> <tr> <th ng-repeat=\"col in model.cols\"> <!--<div ng-if=\"model.showAdvanced && col.sortable\">--> <!--<input type=\"text\" class=\"form-control filter-input\" on-enter=\"model.onEnter()\" ng-model=\"col.filter\" placeholder=\"Filter {{col.name}}\"--> <!--tooltip=\"{{col.type ? 'Use a dash (-) to specify a range' : ''}}\"  tooltip-trigger=\"focus\" tooltip-placement=\"top\">--> <!--</div>--> <!--<a href=\"\" ng-if=\"col.sortable\"--> <!--ng-click=\"model.toggleSort($index)\">{{::col.name}}--> <!--<i class=\"fa\" ng-class=\"{--> <!--'fa-sort'     : model.sort !== $index,--> <!--'fa-sort-down': model.sort === $index &&  model.sortAsc,--> <!--'fa-sort-up'  : model.sort === $index && !model.sortAsc--> <!--}\"></i>--> <!--</a>--> <!--<span ng-if=\"!col.sortable\">--> {{::col.name || col.key}} <!--</span>-->    <tbody> <tr> <td ng-repeat=\"col in model.cols\" fancy-bind-cell>    </table> <!--<pagination ng-if=\"model.resultCount.length > model.pageSize\" total-items=\"model.resultCount.length\" items-per-page=\"model.pageSize\" max-size=\"10\" rotate=\"false\" ng-model=\"model.currentPage\"></pagination>--> </div>"
  );

}]);
