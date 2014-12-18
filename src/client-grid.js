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

    angular.module('sds-angular-controls').directive('clientGrid', clientGrid);

})();
