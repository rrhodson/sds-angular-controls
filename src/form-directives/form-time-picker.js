/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formTimePicker ($timeout) {
        return{
            restrict: 'E',
            replace: true,
            require: '^form-field',
            scope: {
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-time-picker.html',
            link: function (scope, element, attr, container) {
                scope.container = container.$scope;

                if (attr.layoutCss && container.$scope.layout === 'horizontal'){
                    scope.watch('layoutCss', function (){container.$scope.childLayoutCss = scope.layoutCss; });
                }

                scope.$watch('container.record[container.field]', function (val){
                    if (typeof val === 'string'){
                        container.$scope.record[container.$scope.field] = moment.utc(container.$scope.record[container.$scope.field]).toDate();
                    }
                });

                scope.$watch("container.isReadonly", function(newVal){
                    if(newVal) {
                        scope.readOnlyModel = moment(scope.container.record[scope.container.field]).format('h:mm a');
                    }
                });
            }
        }
    }

    angular.module('sds-angular-controls').directive('formTimePicker', formTimePicker);
})();
