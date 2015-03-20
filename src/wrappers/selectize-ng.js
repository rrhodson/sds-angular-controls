(function () {
    angular.module('selectize-ng', [])
        .directive('selectize', function () {
            'use strict';

            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    selectize: '&',
                    options: '&',
                    defaults: '&',
                    selecteditems: '='
                },
                link: function (scope, element, attrs, ngModel) {

                    var changing, runOnce, options, defaultValues, selectize, invalidValues = [];

                    runOnce = false;

                    // Default options
                    options = angular.extend({
                        delimiter: ',',
                        persist: true,
                        mode: (element[0].tagName === 'SELECT') ? 'single' : 'multi'
                    }, scope.selectize() || {});

                    // Activate the widget
                    selectize = element.selectize(options)[0].selectize;

                    selectize.on('change', function () {
                        setModelValue(selectize.getValue());
                    });

                    function setModelValue(value) {
                        if (changing) {
                            if (attrs.selecteditems) {
                                var selected = [];
                                var values = parseValues(value);
                                angular.forEach(values, function (i) {
                                    selected.push(selectize.options[i]);
                                });
                                scope.$apply(function () {
                                    scope.selecteditems = selected;
                                });
                            }
                            return;
                        }

                        scope.$parent.$apply(function () {
                            ngModel.$setViewValue(value);
                            selectize.$control.toggleClass('ng-valid', ngModel.$valid);
                            selectize.$control.toggleClass('ng-invalid', ngModel.$invalid);
                            selectize.$control.toggleClass('ng-dirty', ngModel.$dirty);
                            selectize.$control.toggleClass('ng-pristine', ngModel.$pristine);
                        });


                        if (options.mode === 'single') {
                            selectize.blur();
                        }
                    }

                    // Normalize the model value to an array
                    function parseValues(value) {
                        if (angular.isArray(value)) {
                            return value;
                        }
                        if (!value) {
                            return [];
                        }
                        return String(value).split(options.delimiter);
                    }

                    // Non-strict indexOf
                    function indexOfLike(arr, val) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] == val) {
                                return i;
                            }
                        }
                        return -1;
                    }

                    // Boolean wrapper to indexOfLike
                    function contains(arr, val) {
                        return indexOfLike(arr, val) !== -1;
                    }

                    // Store invalid items for late-loading options
                    function storeInvalidValues(values, resultValues) {
                        values.map(function (val) {
                            if (!(contains(resultValues, val) || contains(invalidValues, val))) {
                                invalidValues.push(val);
                            }
                        });
                    }

                    function restoreInvalidValues(newOptions, values) {
                        var i, index;
                        for (i = 0; i < newOptions.length; i++) {
                            index = indexOfLike(invalidValues, newOptions[i][selectize.settings.valueField]);
                            if (index !== -1) {
                                values.push(newOptions[i][selectize.settings.valueField]);
                                invalidValues.splice(index, 1);
                            }
                        }
                    }

                    function setSelectizeValue(value, old) {
                        if (!value) {
                            setTimeout(function () {
                                selectize.clear();
                                return;
                            });
                        }
                        var values = parseValues(value);
                        if (changing || values === parseValues(selectize.getValue())) {
                            return;
                        }
                        changing = true;
                        if (options.mode === 'single' && value) {
                            setTimeout(function () {
                                selectize.setValue(value);
                                changing = false;
                            });
                        }
                        else if (options.mode === 'multi' && value) {
                            setTimeout(function () {
                                selectize.setValue(values);
                                changing = false;
                                storeInvalidValues(values, parseValues(selectize.getValue()));
                            });
                        }

                        selectize.$control.toggleClass('ng-valid', ngModel.$valid);
                        selectize.$control.toggleClass('ng-invalid', ngModel.$invalid);
                        selectize.$control.toggleClass('ng-dirty', ngModel.$dirty);
                        selectize.$control.toggleClass('ng-pristine', ngModel.$pristine);
                    }

                    function setSelectizeOptions(newOptions) {
                        if (!newOptions) {
                            return;
                        }

                        var values;

                        if (attrs.defaults && !runOnce) {
                            changing = false;
                            values = parseValues(scope.defaults());
                            runOnce = !runOnce;
                        } else if (!attrs.defaults) {
                            values = parseValues(ngModel.$viewValue);
                        }

                        selectize.clearOptions();
                        selectize.addOption(newOptions);
                        selectize.refreshOptions(false);
                        if (options.mode === 'multi' && newOptions && values) {
                            restoreInvalidValues(newOptions, values);
                        }
                        setSelectizeValue(values);
                    }

                    scope.$parent.$watch(attrs.ngModel, setSelectizeValue);

                    if (attrs.options) {
                        scope.$parent.$watchCollection(attrs.options, setSelectizeOptions);
                    }

                    scope.$on('$destroy', function () {
                        selectize.destroy();
                    });
                }
            };
        });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    Selectize.define('dropdown_direction', function (options) {
        var self = this;

        /**
         * Calculates and applies the appropriate position of the dropdown.
         *
         * Supports dropdownDirection up, down and auto. In case menu can't be fitted it's
         * height is limited to don't fall out of display.
         */
        this.positionDropdown = (function () {
            return function () {
                var $control = this.$control;
                var $dropdown = this.$dropdown;
                var p = getPositions();

                // direction
                var direction = getDropdownDirection(p);
                if (direction === 'up') {
                    $dropdown.addClass('direction-up').removeClass('direction-down');
                } else {
                    $dropdown.addClass('direction-down').removeClass('direction-up');
                }
                $control.attr('data-dropdown-direction', direction);

                // position
                var isParentBody = this.settings.dropdownParent === 'body';
                var offset = isParentBody ? $control.offset() : $control.position();
                var fittedHeight;

                switch (direction) {
                    case 'up':
                        offset.top -= p.dropdown.height;
                        if (p.dropdown.height > p.control.above) {
                            fittedHeight = p.control.above - 15;
                        }
                        break;

                    case 'down':
                        offset.top += p.control.height;
                        if (p.dropdown.height > p.control.below) {
                            fittedHeight = p.control.below - 15;
                        }
                        break;
                }

                if (fittedHeight) {
                    this.$dropdown_content.css({'max-height': fittedHeight});
                }

                this.$dropdown.css({
                    width: $control.outerWidth(),
                    top: offset.top,
                    left: offset.left
                });
            };
        })();

        /**
         * Gets direction to display dropdown in. Either up or down.
         */
        function getDropdownDirection(positions) {
            var direction = self.settings.dropdownDirection;

            if (direction === 'auto') {
                // down if dropdown fits
                if (positions.control.below > positions.dropdown.height) {
                    direction = 'down';
                }
                // otherwise direction with most space
                else {
                    direction = (positions.control.above > positions.control.below) ? 'up' : 'down';
                }
            }

            return direction;
        }

        /**
         * Get position information for the control and dropdown element.
         */
        function getPositions() {
            var $control = self.$control;
            var $window = $(window);

            var control_height = $control.outerHeight(false);
            var control_above = $control.offset().top - $window.scrollTop();
            var control_below = $window.height() - control_above - control_height;

            var dropdown_height = self.$dropdown.outerHeight(false);

            return {
                control: {
                    height: control_height,
                    above: control_above,
                    below: control_below
                },
                dropdown: {
                    height: dropdown_height
                }
            };
        }
    });

})();