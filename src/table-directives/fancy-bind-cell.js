
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

    angular.module('sds-angular-controls').directive('fancyBindCell', fancyBindCell);
})();
