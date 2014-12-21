/*! sds-angular-controls - v0.0.1 - 2014-12-21
* https://github.com/SMARTDATASYSTEMSLLC/sds-angular-controls
* Copyright (c) 2014 Steve Gentile, David Benson; Licensed  */
angular.module('sds-angular-controls', ['ui.bootstrap', 'toggle-switch', 'ngSanitize']);

(function (){
    'use strict';
    function $bootbox ($modal, $window) {
        // NOTE: this is a workaround to make BootboxJS somewhat compatible with
        // Angular UI Bootstrap in the absence of regular bootstrap.js
        if ($.fn.modal === undefined) {
            $.fn.modal = function (directive) {
                var that = this;
                if (directive === 'hide') {
                    if (this.data('bs.modal')) {
                        this.data('bs.modal').close();
                        $(that).remove();
                    }
                    return;
                } else if (directive === 'show') {
                    return;
                }

                var modalInstance = $modal.open({
                    template: $(this).find('.modal-content').html()
                });
                this.data('bs.modal', modalInstance);
                setTimeout (function () {
                    $('.modal.ng-isolate-scope').remove();
                    $(that).css({
                        opacity: 1,
                        display: 'block'
                    }).addClass('in');
                }, 100);
            };
        }

        return $window.bootbox;
    }
    $bootbox.$inject = ["$modal", "$window"];

    angular.module('sds-angular-controls').factory('$bootbox',$bootbox);

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

(function () {
    'use strict';
    function clientGrid ($interpolate, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            scope: {
                cols: '=',
                data: '=',
                label: '@',
                hideAdvanced: '@',
                className: '@',
                pageSize: '@'
            },
            templateUrl: 'sds-angular-controls/client-grid.html',
            link: function (scope, element, attrs, fn) {
                scope.vm = {
                    sortAsc: false,
                    sort: _.findIndex(scope.cols, {sortable:true}),
                    currentPage: 1,
                    pageSize: scope.pageSize ? scope.pageSize : 25,
                    showAdvanced: false,
                    filterText: '',
                    toggleSort: toggleSort,
                    // if a callback is specified, and the user clicked on an anchor link or button, call the callback
                    onClick: onClick,
                    onEnter: onEnter,
                    clearFilters: clearFilters,
                    extend: function (col){
                        return _.extend({}, element.parent().scope(), col);
                    }
                };

                function toggleSort(index){
                    if (scope.vm.sort === index)  {
                        scope.vm.sortAsc = ! scope.vm.sortAsc;
                    }else{
                        scope.vm.sort = index;
                    }
                }
                function onEnter(){
                    console.log('enter');
                    if (scope.vm.resultCount.length === 1){
                        $timeout(function (){
                            element.find('tbody tr a:first').click();
                        });
                    }

                }

                function onClick(e, col, row){
                    if (angular.element(e.target).is('a, button, input[type=button]')) {
                        e.preventDefault();
                        col.callback(row);
                    }
                }
                function clearFilters(){
                    _.each(scope.cols, function (item){
                       item.filter = '';
                    });
                }

                if (!scope.cols) {
                    return;
                }

                // generate template rows
                var templateDefault = '';
                // Add in templates per row
                for(var i = 0; i < scope.cols.length; i++){
                    // while the template is currently passed in through the cols array,
                    // I would like to eventually pull these from a child directive of the grid
                    if (typeof scope.cols[i].template !== 'function') {
                        if (scope.cols[i].template) {
                            templateDefault = scope.cols[i].template;
                        }else if (scope.cols[i].key) {
                            templateDefault = '{{' + scope.cols[i].key + '}}';
                        } else {
                            templateDefault = '';
                        }

                        // interpolate is angular's built in template generator.
                        // we are creating a function that can be used to fill templates in the view
                        scope.cols[i].template = $interpolate(templateDefault);
                    }
                }

            }
        };
    }
    clientGrid.$inject = ["$interpolate", "$timeout"];

    angular.module('sds-angular-controls').directive('clientGrid', clientGrid);

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
    FormBase.$inject = ["$q", "$scope", "$rootScope", "$compile", "$timeout"];

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
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){


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

                if($scope.layout === "horizontal"){
                    $scope.labelLayoutCss = $scope.labelLayoutCss || "col-md-2";
                }
                //if($scope.layout === 'inline') {
                //    $scope.labelLayoutCss = $scope.labelLayoutCss || "col-md-4";
                //    $scope.errorLayoutCss = $scope.errorLayoutCss || "col-md-4";
                //}

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
            }]
        }
    }
    formField.$inject = ["$filter", "$rootScope"];

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
                isReadonly      : '=?'  //boolean
            },
            //scope: {
            //    placeholder             : '@',
            //    max                     : '@?',
            //    min                     : '@',
            //    type                    : '@',  //text, email, number etc.. see the InputTypes below
            //    mask                    : '@',
            //    label                   : '@',
            //    isRequired              : '=?',
            //    layout                  : '@', //stacked or inline - default is stacked
            //    labelLayoutCss          : '@', //default col-sm-3
            //    inputLayoutCss          : '@', //default col-sm-5
            //    errorLayoutCss          : '@',  //default col-sm-4
            //    hideValidationMessage   : '=?', //default is false,
            //    showLabel               : '=?',
            //    isReadonly                : '=?',  //expects boolean
            //    style                   : '@?'
            //},
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

                if(scope.min) {
                    $rootScope.$broadcast("input-min", {field: scope.field, min: scope.min});
                }

                if(scope.max) {
                    $rootScope.$broadcast("input-max", {field: scope.field, max: scope.max});
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

(function () {
    'use strict';
    function onEnter (){
        return {
            restrict: 'A',
            link: function(scope,element,attrs) {
                element.bind("keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.onEnter);
                        });
                        event.preventDefault();
                    }
                });
            }
        };
    }

    angular.module('sds-angular-controls').directive('onEnter',onEnter);
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

  $templateCache.put('sds-angular-controls/client-grid.html',
    "<div class=\"table-responsive\"> <div class=\"btn-toolbar\"> <a ng-if=\"vm.showAdvanced\" href=\"\" class=\"btn btn-default\" ng-click=\"vm.clearFilters()\">Clear All Filters <span class=\"big-x\">&times;</span></a> <div ng-if=\"!vm.showAdvanced\" class=\"toolbar-input\"> <div class=\"form-group has-feedback\"> <input class=\"form-control\" type=\"text\" ng-model=\"vm.filterText\" placeholder=\"Filter {{label || 'items'}}\" on-enter=\"vm.onEnter()\"> <a href=\"\" ng-click=\"vm.filterText = ''\" class=\"form-control-feedback feedback-link\">&times;</a> </div> </div> <a href=\"\" ng-if=\"!hideAdvanced\" class=\"btn btn-default\" ng-class=\"{active: vm.showAdvanced}\" ng-click=\"vm.showAdvanced = !vm.showAdvanced\">Advanced Filtering</a> <ng-transclude></ng-transclude> <p ng-show=\"data\"><i>{{vm.resultCount.length}} {{label || 'items'}}</i></p> </div> <table class=\"table table-hover {{className}}\"> <thead> <tr> <th ng-repeat=\"col in cols\"> <div ng-if=\"vm.showAdvanced && col.sortable\"> <input type=\"text\" class=\"form-control filter-input\" on-enter=\"vm.onEnter()\" ng-model=\"col.filter\" placeholder=\"Filter {{col.name}}\" tooltip=\"{{col.type ? 'Use a dash (-) to specify a range' : ''}}\" tooltip-trigger=\"focus\" tooltip-placement=\"top\"> </div> <a href=\"\" ng-if=\"col.sortable\" ng-click=\"vm.toggleSort($index)\">{{::col.name}} <i class=\"fa\" ng-class=\"{\n" +
    "                     'fa-sort'     : vm.sort !== $index,\n" +
    "                     'fa-sort-down': vm.sort === $index &&  vm.sortAsc,\n" +
    "                     'fa-sort-up'  : vm.sort === $index && !vm.sortAsc\n" +
    "                     }\"></i> </a> <span ng-if=\"!col.sortable\"> {{::col.name}} </span>    <tbody> <tr ng-repeat=\"row in (vm.resultCount = (data | complexFilter : (vm.showAdvanced ? cols : vm.filterText)))\n" +
    "                                                      | orderBy       : cols[vm.sort].key       : vm.sortAsc\n" +
    "                                                      | page          : (vm.currentPage - 1)    : vm.pageSize\"> <td ng-repeat-start=\"col in cols\" ng-if=\"col.callback && !col.fieldType\" ng-click=\"vm.onClick($event, col, row)\" ng-bind-html=\"::col.template(vm.extend(row)) | unsafe\">  <td ng-if=\"!col.callback && !col.fieldType\" ng-bind-html=\"::col.template(vm.extend(row)) | unsafe\">  <td ng-repeat-end ng-if=\"col.fieldType\"> <form-field layout=\"grid\" record=\"row\" items=\"col.items\" field=\"{{col.key}}\" type=\"{{col.type}}\" mask=\"{{col.mask}}\" on-label=\"{{col.onLabel}}\" off-label=\"{{col.offLabel}}\" is-required=\"col.isRequired\" field-type=\"{{col.fieldType}}\" date-format=\"{{col.dateFormat}}\" input-layout-css=\"{{col.inputLayoutCss}}\" disable-timepicker=\"col.disableTimepicker\" toggle-switch-type=\"{{col.toggleSwitchType}}\"></form-field>    </table> <pagination ng-if=\"vm.resultCount.length > vm.pageSize\" total-items=\"vm.resultCount.length\" items-per-page=\"vm.pageSize\" ng-model=\"vm.currentPage\"></pagination> </div>"
  );


  $templateCache.put('sds-angular-controls/form-field.html',
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
    "        </div></script> <div ng-if=\"layout === 'stacked'\" class=\"form-group clearfix\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <div class=\"{{::inputLayoutCss}}\"> <label ng-if=\"showLabel\" class=\"control-label {{labelLayoutCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <!--<div class=\"clearfix\">--> <div ng-transclude></div> <!--</div>--> <!-- validation --> <div class=\"pull-left\" ng-include=\"'validation.html'\"></div> </div> </div> <div ng-if=\"layout === 'horizontal'\" class=\"form-group\" ng-form=\"{{field}}\" ng-class=\"{ 'has-error': showError({{field}}) }\"> <label ng-if=\"showLabel\" class=\"control-label {{labelLayoutCss}}\"> {{ label }} <span ng-if=\"isRequired && !isReadonly\">*</span></label> <!--<div class=\"clearfix\">--> <div ng-transclude></div> <!--</div>--> <!-- validation --> <div class=\"pull-right\" ng-include=\"'validation.html'\"></div> </div> </div>"
  );


  $templateCache.put('sds-angular-controls/form-input.html',
    "<div> <div ng-if=\"layout === 'horizontal'\" class=\"{{::layoutCss}}\"> <input class=\"form-control inputField\" ng-model=\"record[field]\" type=\"{{::type}}\" ng-required=\"isRequired\" ng-disabled=\"isReadonly\" placeholder=\"{{::placeholder}}\" max=\"{{::max}}\" min=\"{{::min}}\" style=\"{{::style}}\" mask-input=\"{{::mask}}\"> </div> <div ng-if=\"layout === 'stacked'\"> <input class=\"form-control inputField {{::layoutCss}}\" ng-model=\"record[field]\" type=\"{{::type}}\" ng-required=\"isRequired\" ng-disabled=\"isReadonly\" placeholder=\"{{::placeholder}}\" max=\"{{::max}}\" min=\"{{::min}}\" style=\"{{::style}}\" mask-input=\"{{::mask}}\"> </div> <div ng-if=\"log\"> form-input value: {{record[field]}}<br> {{isRequired}} </div> </div>"
  );

}]);

(function (){
    'use strict';

    function unsafe ($sce) { return $sce.trustAsHtml; }
    unsafe.$inject = ["$sce"];

    angular.module('sds-angular-controls').filter('unsafe', unsafe);
})();
