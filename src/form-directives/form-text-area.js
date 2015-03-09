/**
 * Created by stevegentile on 12/19/14.
 */
(function () {
    'use strict';
    function formTextArea ($timeout) {
        return{
            restrict: 'EA',
            replace: true,
            require: '^formField',
            scope: {
                style           : '@?',
                layoutCss       : '@?' //default col-md-6
            },
            templateUrl: 'sds-angular-controls/form-directives/form-text-area.html',
            link: function (scope, element, attr, container) {
                var input = element.find('textarea');
                scope.container = container.$scope;

                if (attr.layoutCss && container.$scope.layout === 'horizontal'){
                    scope.watch('layoutCss', function (){container.$scope.childLayoutCss = scope.layoutCss; });
                }

                if (container.$scope.isAutofocus){
                    $timeout(function (){element.find('textarea').focus(); });
                }
            }
        }
    }

    angular.module('sds-angular-controls').directive('formTextArea', formTextArea);
})();
