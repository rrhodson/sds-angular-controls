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
    function dbGrid ($filter, $timeout, $q) {
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            scope:true,
            templateUrl: 'sds-angular-controls/table-directives/db-grid.html',
            compile: function (tElement, tAttrs){
                var loop = tAttrs.for.split(' ');
                if (loop.length !== 1 && loop[1] != 'in') {
                    console.error('Invalid loop');
                    return;
                }

                tElement.find('tbody > tr').attr('ng-repeat', loop[0] + ' in _model.filteredItems');
            },
            controller: function ($scope, $element, $attrs){
                var complexFilter = $filter('complexFilter');
                var orderByFilter = $filter('orderBy');
                var pageFilter = $filter('page');

                $scope._model = {
                    label: $attrs.label,
                    layoutCss: $attrs.layoutCss,
                    currentPage: 1,
                    total: 0,
                    sortAsc: $attrs.sort ? $attrs.sort[0] !== '-' : true,
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
                $scope.$grid = {
                    refresh: function(){
                        // hard refresh all rows
                        $scope._model.filteredItems = [];
                        $timeout(refresh);
                    },
                    items: function (){ return $scope._model.filteredItems; }
                };

                var loop = $attrs.for.split(' ');
                $scope._model.rowName = loop[0];
                if (loop[2]) {
                    $scope.$watchCollection(loop.slice(2).join(' '), function (items) {
                        $scope._model.items = items;
                        refresh();
                    });
                }

                function defaultGetItems (filter, sortKey, sortAsc, page, pageSize, cols){
                    var deferred = $q.defer();
                    var items = orderByFilter(complexFilter($scope._model.items, filter), sortKey, !sortAsc);
                    $scope._model.total = items ? items.length : 0;
                    deferred.resolve(pageFilter(items, page, pageSize));
                    return deferred.promise;
                }

                function toggleSort(index){
                    console.log(index);
                    if ($scope._model.sort === index)  {
                        $scope._model.sortAsc = !$scope._model.sortAsc;
                    }else{
                        $scope._model.sort = index;
                    }
                }

                function clearFilters(){
                    _.each($scope._model.cols, function (item){
                       item.filter = '';
                    });
                    refresh();
                }

                function onEnter(){
                    console.log('enter');
                    if ($scope._model.items.length === 1){
                        $timeout(function (){
                            $element.find('tbody tr a:first').click();
                        });
                    }
                }

                function refresh() {
                    $timeout(function () {
                        $scope._model.getItems(
                            $scope._model.showAdvancedFilter ? $scope._model.cols : $scope._model.filterText,
                            $scope._model.sort !== null ? $scope._model.cols[$scope._model.sort].key : null,
                            $scope._model.sortAsc,
                            $scope._model.currentPage - 1,
                            $scope._model.pageSize,
                            $scope._model.cols
                        ).then(function (result){
                            $scope._model.filteredItems = result;
                        });
                    });
                }

                this.addColumn = function (item){
                    var sort = $attrs.sort || '';
                    if (sort[0] === '-' || sort[0] === '+'){
                        sort = sort.slice(1);
                    }

                    if (sort && sort === item.key && $scope._model.sort === null){
                        $scope._model.sort = $scope._model.cols.length;
                    }
                    $scope._model.cols.push(item);
                };

                this.setDataSource = function (dataSource){
                    $scope._model.getItems = dataSource;
                    refresh();
                };

                this.setTotal = function (total){
                    $scope._model.total = total;
                };

                $scope.$watch('_model.currentPage', $scope._model.refresh);
                $scope.$watch('_model.sort',        $scope._model.refresh);
                $scope.$watch('_model.sortAsc',     $scope._model.refresh);
                $scope.$watch('_model.filterText',  $scope._model.refresh);
            }
        };
    }

    angular.module('sds-angular-controls').directive('dbGrid', dbGrid);

})();
