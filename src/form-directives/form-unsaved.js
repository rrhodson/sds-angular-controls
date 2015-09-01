/**
 * Created by stevegentile on 8/31/15.
 */
(function(){
    'use strict';
    function formUnsaved ($rootScope, $window) {
        return {
            restrict: 'A',
            require: '^form',
            link: function($scope, element, attrs, form){

                function routeChange(event) {
                    if(form.$dirty){
                        var confirm = $window.confirm('You have unsaved changes');
                        if(!confirm) {
                            $rootScope.$broadcast("cancelProgressLoader");
                            event.preventDefault();
                        }
                        console.log(confirm, event);
                    }
                }

                $scope.$on('$routeChangeStart', routeChange);

            }
        }
    }

    angular.module('sds-angular-controls').directive('formUnsaved', formUnsaved);
})();