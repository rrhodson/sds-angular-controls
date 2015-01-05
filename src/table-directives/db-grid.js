(function () {
    'use strict';

    /**
     * Creates a grid with sorting, paging, filtering, and the ability to add custom data sources.
     * Can contain custom toolbar buttons, a custom data source element, and a list of db-cols.
     *
     * <db-grid for="items in item">
     *     <db-column key="name"></db-column>
     * </db-grid>
     *
     * @param {string}     format    - A label to put next to the count (TODO: make this customizable)
     * @param {string}     layoutCss - A css class to add to the table
     * @param {string}     filter    - One of the options 'none', 'simple' or 'advanced'. Defaults to 'advanced'. Bound once.
     * @param {int}        pageSize  - The page size, defaults to 25. Bound once.
     * @param {expression} for       - Required. Either 'item in items' or (when used with a custom data source) just 'item'
     */
    function dbGrid ($filter, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            scope: {
                label: '@',
                layoutCss: '@'
            },
            templateUrl: 'sds-angular-controls/table-directives/db-grid.html',
            compile: function (tElement, tAttrs){
                var loop = tAttrs.for.split(' ');
                if (loop.length !== 1 && loop[1] != 'in') {
                    console.error('Invalid loop');
                    return;
                }

                tElement.find('tbody > tr').attr('ng-repeat', loop[0] + ' in model.filteredItems');

            },
            controller: function ($scope, $element, $attrs){
                var complexFilter = $filter('complexFilter');
                var orderByFilter = $filter('orderBy');
                var pageFilter = $filter('page');

                $scope.model = {
                    currentPage: 1,
                    total: 0,
                    sortAsc: false,
                    sort: null,
                    filterText: '',
                    showAdvancedFilter: false,
                    pageSize: $attrs.pageSize ? parseInt($attrs.pageSize, 10) : 25,
                    filterType: ($attrs.filter || 'advanced').toLowerCase(),
                    cols: [],
                    items: [],
                    filteredItems: [],
                    getItems: defaultGetItems,
                    toggleSort: toggleSort,
                    clearFilters: clearFilters,
                    onEnter: onEnter,
                    refresh: _.debounce(refresh, 250)
                };

                var loop = $attrs.for.split(' ');
                $scope.rowName = loop[0];
                if (loop[2]) {
                    $element.parent().scope().$watch(loop[2], function (items) {
                        $scope.model.items = items;
                        refresh();
                    });
                }

                function defaultGetItems (filter, sortKey, sortAsc, page, pageSize, cols){
                    var items = orderByFilter(complexFilter($scope.model.items, filter), sortKey, sortAsc);
                    $scope.model.total = items.length;
                    return pageFilter(items, page, pageSize);
                }

                function toggleSort(index){
                    console.log(index);
                    if ($scope.model.sort === index)  {
                        $scope.model.sortAsc = !$scope.model.sortAsc;
                    }else{
                        $scope.model.sort = index;
                    }
                }

                function clearFilters(){
                    _.each($scope.model.cols, function (item){
                       item.filter = '';
                    });
                    refresh();
                }

                function onEnter(){
                    console.log('enter');
                    if ($scope.model.items.length === 1){
                        $timeout(function (){
                            $element.find('tbody tr a:first').click();
                        });
                    }
                }

                function refresh(val, old) {
                    $timeout(function () {
                        $scope.model.filteredItems = $scope.model.getItems(
                            $scope.model.showAdvancedFilter ? $scope.model.cols : $scope.model.filterText,
                            $scope.model.sort ? $scope.model.cols[$scope.model.sort].key : null,
                            $scope.model.sortAsc,
                            $scope.model.currentPage - 1,
                            $scope.model.pageSize,
                            $scope.model.cols
                        );
                    });
                }

                this.addColumn = function (item){
                    $scope.model.cols.push(item);
                };

                this.setDataSource = function (dataSource){
                    $scope.model.getItems = dataSource;
                    refresh();
                };

                this.setTotal = function (total){
                    $scope.model.total = total;
                };

                $scope.$watch('model.currentPage', $scope.model.refresh);
                $scope.$watch('model.sort',        $scope.model.refresh);
                $scope.$watch('model.sortAsc',     $scope.model.refresh);
                $scope.$watch('model.filterText',  $scope.model.refresh);
            }
        };
    }

    angular.module('sds-angular-controls').directive('dbGrid', dbGrid);

})();
