
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

    angular.module('sds-angular-controls').directive('fancyColumn', fancyColumn);
})();
